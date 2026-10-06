import { models } from "../../models/index.js";
import { leaveBalance } from "../../services/leaveBalanceService.js";
import { publicEmployee } from "../../services/profileService.js";
import { payCycleRange } from "../../utils/date.js";

const WORKING_DAYS_PER_CYCLE = 22;

export async function home(user) {
  const [profile, leaves, payslips] = await Promise.all([
    models.employees.findOne({ empid: user.empid }).lean(),
    models.leaves.find({ empid: user.empid }).sort({ createdAt: -1 }).limit(5).lean(),
    models.payslips.find({ empid: user.empid }).sort({ createdAt: -1 }).limit(5).lean()
  ]);
  return { profile: publicEmployee(profile), leaves, payslips };
}

// Personal stats for the signed-in employee's dashboard.
export async function dashboardStats(user) {
  const [start, end] = payCycleRange();
  const empid = user.empid;
  const [balance, attendanceRows] = await Promise.all([
    leaveBalance(empid),
    models.attendance.find({ emp_id: empid, attendance_date: { $gte: start, $lte: end } }).lean()
  ]);

  const presentScore = attendanceRows.reduce((sum, row) => sum + (row.status === "Half Day" ? 0.5 : row.status === "Present" ? 1 : 0), 0);
  const totalWorkSeconds = attendanceRows.reduce((sum, row) => sum + (row.work_seconds || 0), 0);

  return [
    {
      label: "Leave Balance",
      value: balance.balance ?? "-",
      icon: "bi-calendar4-week",
      meta: balance.balance === null ? balance.note : `Available · ${balance.per_month} earned per month`
    },
    { label: "Attendance", value: `${Math.round((presentScore / WORKING_DAYS_PER_CYCLE) * 100) || 0}%`, icon: "bi-people", meta: "Current cycle" },
    { label: "Work Hours", value: `${Math.floor(totalWorkSeconds / 3600)} Hrs`, icon: "bi-clock-history", meta: "This period" },
    { label: "Performance", value: "4.5 / 5", icon: "bi-star-fill", meta: "This month" }
  ];
}
