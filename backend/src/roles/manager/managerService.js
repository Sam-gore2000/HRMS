import { ROLES } from "../../constants/roles.js";
import { models } from "../../models/index.js";

// Managers get the same personal dashboard as employees.
export { dashboardStats } from "../employee/employeeService.js";

function teamFilter(user) {
  return user.role === ROLES.ADMIN ? {} : { report_manager_id: user.empid };
}

export async function team(user) {
  const members = await models.employees.find(teamFilter(user)).sort({ fname: 1 }).lean();
  return { members };
}

export async function approvals(user) {
  const filter = teamFilter(user);
  const [leaves, attendanceRequests] = await Promise.all([
    models.leaves.find({ ...filter, status: 0 }).sort({ createdAt: -1 }).lean(),
    models.attendanceRequests.find({ ...filter, status: 0 }).sort({ createdAt: -1 }).lean()
  ]);
  return { leaves, attendanceRequests };
}
