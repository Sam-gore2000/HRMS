from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import dashboard_controller
from app.db.session import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def dashboard(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return dashboard_controller.dashboard(db, user)


@router.get("/notifications")
def notifications(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return dashboard_controller.notifications(db, user)
