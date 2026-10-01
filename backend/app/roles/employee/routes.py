from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.middleware.auth import require_roles
from app.roles.employee import controllers

router = APIRouter(tags=["employee"])


@router.get("/home")
def home(db: Session = Depends(get_db), user: dict = Depends(require_roles("employee", "manager", "admin"))):
    return controllers.home(db, user)
