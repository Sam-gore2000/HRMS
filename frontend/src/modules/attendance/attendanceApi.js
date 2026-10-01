import { api } from "../../services/api.js";

export const attendanceApi = {
  status: () => api("/attendance/status"),
  punchIn: () => api("/attendance/punch-in", { method: "POST" }),
  punchOut: () => api("/attendance/punch-out", { method: "POST" }),
  startBreak: () => api("/attendance/breaks/start", { method: "POST" }),
  stopBreak: () => api("/attendance/breaks/stop", { method: "POST" }),
  monthlyReport: (month, empId = "") =>
    api(`/attendance/report/monthly?month=${encodeURIComponent(month)}${empId ? `&emp_id=${encodeURIComponent(empId)}` : ""}`)
};
