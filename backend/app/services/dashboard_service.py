from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.db_helpers import rows_to_dicts
from app.utils.dates import attendance_cycle, today_ist, working_days


def _employee_stats(db: Session, empid: str) -> list[dict]:
    start, end = attendance_cycle()
    leave_used = db.execute(
        text('SELECT COALESCE(SUM(total_leave), 0) FROM "user_leave" WHERE empid = :empid AND status = 1'),
        {"empid": empid},
    ).scalar() or 0
    attendance_rows = db.execute(
        text('SELECT status, total_seconds FROM "attendance_data" WHERE emp_id = :empid AND attendance_date BETWEEN :start AND :end'),
        {"empid": empid, "start": start, "end": end},
    ).mappings().all()
    present_score = 0
    total_seconds = 0
    for row in attendance_rows:
        if row.get("status") == "Present":
            present_score += 1
        elif row.get("status") == "Half Day":
            present_score += 0.5
        total_seconds += int(row.get("total_seconds") or 0)
    workdays = working_days(start, end)
    attendance_pct = round((present_score / workdays) * 100) if workdays else 0
    return [
        {"label": "Leave Balance", "value": str(18 - int(leave_used)), "meta": "Available", "icon": "bi-calendar4-week"},
        {"label": "Attendance", "value": f"{attendance_pct}%", "meta": "Current cycle", "icon": "bi-people"},
        {"label": "Work Hours", "value": f"{total_seconds // 3600} Hrs", "meta": "This period", "icon": "bi-clock-history"},
        {"label": "Performance", "value": "4.5 / 5", "meta": "This month", "icon": "bi-star-fill"},
    ]


def _admin_stats(db: Session) -> list[dict]:
    total_employees = db.execute(text('SELECT COUNT(*) FROM "emp_details"')).scalar() or 0
    pending_leaves = db.execute(text('SELECT COUNT(*) FROM "user_leave" WHERE status = 0')).scalar() or 0
    today_present = db.execute(text('SELECT COUNT(*) FROM "attendance_data" WHERE attendance_date = :today AND status IN (\'Present\', \'Half Day\')'), {"today": today_ist()}).scalar() or 0
    open_queries = db.execute(text('SELECT COUNT(*) FROM "emp_query" WHERE status = 0')).scalar() or 0
    return [
        {"label": "Employees", "value": str(total_employees), "meta": "Active records", "icon": "bi-people"},
        {"label": "Pending Leaves", "value": str(pending_leaves), "meta": "Awaiting action", "icon": "bi-calendar4-week"},
        {"label": "Attendance", "value": str(today_present), "meta": "Present today", "icon": "bi-record-circle"},
        {"label": "Queries", "value": str(open_queries), "meta": "Pending", "icon": "bi-question-circle"},
    ]


def get_dashboard(db: Session, user: dict) -> dict:
    stats = _admin_stats(db) if user.get("role") == "admin" else _employee_stats(db, user.get("empid"))
    notices = rows_to_dicts(db.execute(text('SELECT * FROM "notice" ORDER BY created_at DESC NULLS LAST, id DESC LIMIT 20')).all())
    return {"stats": stats, "notices": notices}


def get_notifications(db: Session, user: dict) -> dict:
    rows = db.execute(text('SELECT heading FROM "notice" ORDER BY created_at DESC NULLS LAST, id DESC LIMIT 5')).mappings().all()
    return {"notifications": [row["heading"] for row in rows]}
