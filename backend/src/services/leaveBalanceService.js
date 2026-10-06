import { env } from "../config/env.js";
import { models } from "../models/index.js";
import { todayKey } from "../utils/date.js";
import { httpError } from "../utils/httpError.js";
import { holidayMap, normalizeDate, workingDaysBetween } from "../utils/workdays.js";

const APPROVED = 1;
const PENDING = 0;
const MAX_ADJUSTMENT_DAYS = 365;

// Months credited from the joining month up to the current month, both included
// (joined 5 Oct -> October is month 1).
function monthsSince(joinDate, today) {
  const [joinYear, joinMonth] = joinDate.split("-").map(Number);
  const [year, month] = today.split("-").map(Number);
  return Math.max(0, (year - joinYear) * 12 + (month - joinMonth) + 1);
}

const round = (value) => Math.round(value * 100) / 100;

function leaveDays(leave, holidays) {
  const days = workingDaysBetween(leave.leave1, leave.leave2, holidays);
  return days || (normalizeDate(leave.leave1) ? 0 : Number(leave.total_leave) || 0);
}

// Paid leave balance = earned + admin adjustments - approved leave.
//  earned:   LEAVE_ACCRUAL_PER_MONTH (1.5) days for every month since joining
//  adjusted: manual changes by an admin (see adjustLeaveBalance)
//  used:     approved leave, working days only (weekly offs and holidays are not deducted)
export async function leaveBalance(empid) {
  const employee = await models.employees.findOne({ empid }).lean();
  const joined = normalizeDate(employee?.jdate);
  const today = todayKey();
  const [leaves, holidays, adjustments] = await Promise.all([
    models.leaves.find({ empid, status: { $in: [APPROVED, PENDING] } }).lean(),
    holidayMap(),
    models.leaveAdjustments.find({ empid }).sort({ createdAt: -1 }).lean()
  ]);

  const used = leaves.filter((leave) => Number(leave.status) === APPROVED).reduce((sum, leave) => sum + leaveDays(leave, holidays), 0);
  const pending = leaves.filter((leave) => Number(leave.status) === PENDING).reduce((sum, leave) => sum + leaveDays(leave, holidays), 0);
  const adjusted = round(adjustments.reduce((sum, item) => sum + (Number(item.days) || 0), 0));
  const perMonth = env.leaveAccrualPerMonth;
  const history = adjustments.slice(0, 10).map(({ _id, days, reason, mode, balance_before, balance_after, by, createdAt }) => ({ _id, days, reason, mode, balance_before, balance_after, by, createdAt }));

  const validJoin = joined && joined <= today;
  // Without a joining date nothing is earned, but an admin can still set a balance manually.
  if (!validJoin && !adjustments.length) {
    return { empid, joined: joined || null, per_month: perMonth, months: 0, earned: null, adjusted, used, pending, balance: null, adjustments: history, note: joined ? "Joining date is in the future" : "Joining date not set" };
  }
  const months = validJoin ? monthsSince(joined, today) : 0;
  const earned = round(months * perMonth);
  return { empid, joined: validJoin ? joined : null, per_month: perMonth, months, earned, adjusted, used, pending, balance: round(earned + adjusted - used), adjustments: history };
}

// Admin: change a balance by hand.
//   mode "set": make the available balance exactly `days`;  mode "add": add `days` (negative removes).
export async function adjustLeaveBalance(admin, { emp_id: empid, mode = "add", days, reason } = {}) {
  const value = Number(days);
  if (!empid) throw httpError(400, "Choose an employee.");
  if (!["set", "add"].includes(mode)) throw httpError(400, "Unknown adjustment type.");
  if (!Number.isFinite(value) || Math.abs(value) > MAX_ADJUSTMENT_DAYS) throw httpError(400, "Enter a number of days.");
  if (Math.round(value * 2) !== value * 2) throw httpError(400, "Use whole or half days (e.g. 1, 1.5, 2).");
  if (mode === "set" && value < 0) throw httpError(400, "The balance can't be set below 0.");
  if (!String(reason || "").trim()) throw httpError(400, "Please add a reason for the change.");

  const employee = await models.employees.findOne({ empid: String(empid).trim() }).lean();
  if (!employee) throw httpError(404, `No employee with ID ${empid}.`);

  const before = await leaveBalance(employee.empid);
  const current = before.balance ?? 0;
  const delta = round(mode === "set" ? value - current : value);
  if (delta === 0) throw httpError(400, mode === "set" ? `The balance is already ${current}.` : "Enter a number other than 0.");

  await models.leaveAdjustments.create({
    empid: employee.empid,
    days: delta,
    reason: String(reason).trim().slice(0, 300),
    mode,
    balance_before: current,
    balance_after: round(current + delta),
    by: admin.username || admin.name || "admin"
  });
  return { data: await leaveBalance(employee.empid) };
}
