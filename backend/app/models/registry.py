from dataclasses import dataclass


@dataclass(frozen=True)
class ResourceConfig:
    table: str
    title: str
    columns: tuple[str, ...]
    searchable: tuple[str, ...]
    owner_column: str | None = None
    manager_column: str | None = None
    mutable: bool = True


RESOURCE_CONFIGS: dict[str, ResourceConfig] = {
    "admins": ResourceConfig("admin", "Admin Access", ("id", "username", "email"), ("username", "email")),
    "employees": ResourceConfig("emp_details", "Employee Details", ("id", "empid", "fname", "email", "phno", "department", "position", "status"), ("empid", "fname", "email", "department", "position"), owner_column="empid", manager_column="report_manager_id"),
    "leaves": ResourceConfig("user_leave", "Leave Details", ("id", "fname", "empid", "leavet", "leave1", "leave2", "total_leave", "reason", "response", "status"), ("fname", "empid", "leavet", "reason"), owner_column="empid", manager_column="report_manager_id"),
    "attendance": ResourceConfig("attendance_data", "Attendance Details", ("id", "emp_id", "attendance_date", "punch_in", "punch_out", "total_seconds", "status"), ("emp_id", "status"), owner_column="emp_id"),
    "breaks": ResourceConfig("break_data", "Break Report", ("id", "emp_id", "break_date", "break_in", "break_out", "total_seconds"), ("emp_id",), owner_column="emp_id"),
    "bankDetails": ResourceConfig("bank_details", "Bank Details", ("id", "empid", "employeeName", "designation", "department", "tsalary", "accountNumber", "bankName", "ifscCode"), ("empid", "employeeName", "department", "bankName"), owner_column="empid"),
    "payslips": ResourceConfig("payslip", "Payslip", ("id", "empid", "employeeName", "month", "year", "tsalary", "netSalary", "deductions", "remarks"), ("empid", "employeeName", "month", "year"), owner_column="empid"),
    "holidays": ResourceConfig("holiday", "Holidays", ("id", "hdname", "hddate", "descr"), ("hdname", "descr")),
    "notices": ResourceConfig("notice", "HR Notice", ("id", "heading", "descr", "created_at"), ("heading", "descr")),
    "queries": ResourceConfig("emp_query", "Query Details", ("id", "emp_id", "emp_name", "date", "email", "contact", "subject", "message", "status"), ("emp_id", "emp_name", "subject", "message"), owner_column="emp_id"),
    "projects": ResourceConfig("project", "Project Details", ("id", "project", "description", "date", "duedate", "budget", "projectclient", "status", "app_type"), ("project", "description", "projectclient", "status")),
    "teams": ResourceConfig("team_member", "Department", ("id", "team_name", "team_lead", "tmember_1", "tmember_2", "tmember_3", "tmember_4", "tmember_5"), ("team_name", "team_lead")),
    "tasks": ResourceConfig("assign_task", "Task Details", ("id", "emp_id", "emp_project", "emp_team", "task", "start_date", "due_date", "status", "priority"), ("emp_id", "emp_project", "emp_team", "task", "status"), owner_column="emp_id"),
    "meetings": ResourceConfig("meeting", "Team Meeting", ("id", "organiser", "team", "emp", "date", "time", "link", "message"), ("organiser", "team", "emp", "message")),
    "dprs": ResourceConfig("dpr", "Daily Report", ("id", "empid", "workmode", "pname", "wout", "status"), ("empid", "workmode", "pname", "status"), owner_column="empid"),
    "timesheets": ResourceConfig("timesheet", "Timesheet", ("id", "team", "project", "task", "date", "enddate", "note"), ("team", "project", "task", "note")),
    "attendanceRequests": ResourceConfig("attendance_res", "Attendance Res Details", ("id", "name", "empid", "date", "punch_in", "punch_out", "reason", "status"), ("name", "empid", "reason"), owner_column="empid", manager_column="report_manager_id"),
    "userLogs": ResourceConfig("user_log", "Login Details", ("id", "session_id", "emp_id", "date", "in_timestamp", "out_timestamp", "sessTime", "status"), ("emp_id", "status"), owner_column="emp_id", mutable=False),
}


def get_resource_config(resource: str) -> ResourceConfig:
    if resource not in RESOURCE_CONFIGS:
        raise KeyError(resource)
    return RESOURCE_CONFIGS[resource]
