from sqlalchemy.orm import Session

from app.services import attendance_service


def today(db: Session, user: dict) -> dict:
    return attendance_service.get_today_attendance(db, user)


def toggle(db: Session, user: dict) -> dict:
    return attendance_service.toggle_attendance(db, user)


def breaks_today(db: Session, user: dict) -> dict:
    return attendance_service.get_today_breaks(db, user)


def toggle_break(db: Session, user: dict) -> dict:
    return attendance_service.toggle_break(db, user)
