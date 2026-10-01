from sqlalchemy.orm import Session

from app.services import dashboard_service


def dashboard(db: Session, user: dict) -> dict:
    return dashboard_service.get_dashboard(db, user)


def notifications(db: Session, user: dict) -> dict:
    return dashboard_service.get_notifications(db, user)
