from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import auth_controller
from app.db.session import get_db
from app.middleware.auth import get_current_user
from app.schemas.auth import LoginRequest, PasswordChangeRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return auth_controller.login(db, payload)


@router.post("/logout")
def logout(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return auth_controller.logout(db, user)


@router.put("/profile")
def update_profile(payload: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return auth_controller.update_profile(db, user, payload)


@router.put("/password")
def change_password(payload: PasswordChangeRequest, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return auth_controller.change_password(db, user, payload)
