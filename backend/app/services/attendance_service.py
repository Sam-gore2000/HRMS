from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.db_helpers import row_to_dict
from app.utils.dates import now_ist, today_ist


def get_today_attendance(db: Session, user: dict) -> dict:
    row = db.execute(
        text('SELECT * FROM "attendance_data" WHERE emp_id = :emp_id AND attendance_date = :today LIMIT 1'),
        {"emp_id": user.get("empid"), "today": today_ist()},
    ).mappings().first()
    return row_to_dict(row) or {}


def toggle_attendance(db: Session, user: dict) -> dict:
    emp_id = user.get("empid")
    today = today_ist()
    now = now_ist().replace(microsecond=0)
    row = db.execute(
        text('SELECT * FROM "attendance_data" WHERE emp_id = :emp_id AND attendance_date = :today LIMIT 1'),
        {"emp_id": emp_id, "today": today},
    ).mappings().first()

    if not row:
        db.execute(
            text('INSERT INTO "attendance_data" (emp_id, attendance_date, punch_in) VALUES (:emp_id, :today, :punch_in)'),
            {"emp_id": emp_id, "today": today, "punch_in": now},
        )
        db.commit()
        return {"action": "punchin", "punch_in": now.isoformat()}

    data = dict(row)
    if data.get("punch_in") and data.get("punch_out") is not None:
        return {"action": "already_done"}

    punch_in = data.get("punch_in")
    if isinstance(punch_in, str):
        punch_in = datetime.fromisoformat(punch_in)
    worked_seconds = int((now - punch_in).total_seconds())
    if worked_seconds < 60:
        return {"action": "too_fast"}
    status = "Present" if worked_seconds >= 28800 else "Half Day" if worked_seconds >= 14400 else "Absent"
    db.execute(
        text('UPDATE "attendance_data" SET punch_out = :punch_out, total_seconds = :total_seconds, status = :status WHERE emp_id = :emp_id AND attendance_date = :today'),
        {"punch_out": now, "total_seconds": worked_seconds, "status": status, "emp_id": emp_id, "today": today},
    )
    db.commit()
    return {"action": "punchout", "seconds": worked_seconds, "status": status}


def get_today_breaks(db: Session, user: dict) -> dict:
    rows = db.execute(
        text('SELECT * FROM "break_data" WHERE emp_id = :emp_id AND break_date = :today ORDER BY id ASC'),
        {"emp_id": user.get("empid"), "today": today_ist()},
    ).mappings().all()
    total = 0
    active = None
    for row in rows:
        if row.get("break_in") and row.get("break_out"):
            total += int(row.get("total_seconds") or 0)
        elif row.get("break_in"):
            active = row.get("break_in")
    return {"total_break_seconds": total, "active_break_start": active}


def toggle_break(db: Session, user: dict) -> dict:
    emp_id = user.get("empid")
    today = today_ist()
    now = now_ist().replace(microsecond=0)
    active = db.execute(
        text('SELECT * FROM "break_data" WHERE emp_id = :emp_id AND break_date = :today AND break_out IS NULL ORDER BY id DESC LIMIT 1'),
        {"emp_id": emp_id, "today": today},
    ).mappings().first()
    if not active:
        db.execute(
            text('INSERT INTO "break_data" (emp_id, break_date, break_in) VALUES (:emp_id, :today, :break_in)'),
            {"emp_id": emp_id, "today": today, "break_in": now},
        )
        db.commit()
        return {"action": "break_start", "break_in": now.isoformat()}
    start = active.get("break_in")
    if isinstance(start, str):
        start = datetime.fromisoformat(start)
    seconds = int((now - start).total_seconds())
    db.execute(
        text('UPDATE "break_data" SET break_out = :break_out, total_seconds = :seconds WHERE id = :id'),
        {"break_out": now, "seconds": seconds, "id": active.get("id")},
    )
    db.commit()
    return {"action": "break_end", "seconds": seconds}
