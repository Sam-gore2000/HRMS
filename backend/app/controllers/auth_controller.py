from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, PasswordChangeRequest
from app.services import auth_service


def login(db: Session, payload: LoginRequest) -> dict:
    return auth_service.login(db, payload)


def logout(db: Session, user: dict) -> dict:
    return auth_service.logout(db, user)


def update_profile(db: Session, user: dict, payload: dict) -> dict:
    return auth_service.update_profile(db, user, payload)


def change_password(db: Session, user: dict, payload: PasswordChangeRequest) -> dict:
    return auth_service.change_password(db, user, payload)
