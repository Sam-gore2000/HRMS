from sqlalchemy.orm import Session

from app.roles.manager import services


def team(db: Session, user: dict) -> dict:
    return services.manager_team(db, user)
