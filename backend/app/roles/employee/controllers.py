from sqlalchemy.orm import Session

from app.roles.employee import services


def home(db: Session, user: dict) -> dict:
    return services.employee_home(db, user)
