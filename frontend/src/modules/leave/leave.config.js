export const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Paid Leave", "Emergency Leave"];

export const leaveConfig = {
  resource: "leaves",
  selfService: true,
  approvable: true,
  fields: [
    { name: "empid", label: "Employee ID", employee: "id" },
    { name: "fname", label: "Employee Name", employee: "name" },
    { name: "report_manager_id", label: "Report Manager ID", employee: "manager" },
    { name: "leavet", label: "Leave Type", type: "select", options: LEAVE_TYPES },
    { name: "leave1", label: "Start Date", type: "date" },
    { name: "leave2", label: "End Date", type: "date" },
    { name: "reason", label: "Reason", type: "textarea" },
    { name: "response", label: "Response", type: "textarea", approverOnly: true }
  ]
};
