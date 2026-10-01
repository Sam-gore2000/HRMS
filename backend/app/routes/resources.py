from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.controllers import resource_controller
from app.db.session import get_db
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("/{resource}")
def list_resource(resource: str, q: str | None = Query(default=None), db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return resource_controller.list_resource(db, resource, user, q)


@router.post("/{resource}")
def create_resource(resource: str, payload: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return resource_controller.create_resource(db, resource, user, payload)


@router.put("/{resource}/{record_id}")
def update_resource(resource: str, record_id: int, payload: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return resource_controller.update_resource(db, resource, record_id, user, payload)


@router.delete("/{resource}/{record_id}")
def delete_resource(resource: str, record_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return resource_controller.delete_resource(db, resource, record_id, user)


@router.patch("/{resource}/{record_id}/status")
def update_status(resource: str, record_id: int, payload: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return resource_controller.update_status(db, resource, record_id, user, int(payload.get("status", 0)))
