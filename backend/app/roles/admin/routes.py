from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.middleware.auth import require_roles
from app.roles.admin import controllers

router = APIRouter(tags=["admin"])


@router.get("/overview")
def overview(db: Session = Depends(get_db), user: dict = Depends(require_roles("admin"))):
    return controllers.overview(db)
