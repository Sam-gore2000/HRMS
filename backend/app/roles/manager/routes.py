from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.middleware.auth import require_roles
from app.roles.manager import controllers

router = APIRouter(tags=["manager"])


@router.get("/team")
def team(db: Session = Depends(get_db), user: dict = Depends(require_roles("manager", "admin"))):
    return controllers.team(db, user)
