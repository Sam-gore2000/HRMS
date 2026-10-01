from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import attendance_controller
from app.db.session import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("/today")
def today(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return attendance_controller.today(db, user)


@router.post("/toggle")
def toggle(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return attendance_controller.toggle(db, user)


@router.get("/breaks/today")
def breaks_today(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return attendance_controller.breaks_today(db, user)


@router.post("/breaks/toggle")
def toggle_break(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return attendance_controller.toggle_break(db, user)
