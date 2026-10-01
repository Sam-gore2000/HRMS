from sqlalchemy.orm import Session

from app.services import resource_service


def list_resource(db: Session, resource: str, user: dict, q: str | None = None) -> dict:
    return resource_service.list_resource(db, resource, user, q)


def create_resource(db: Session, resource: str, user: dict, payload: dict) -> dict:
    return resource_service.create_resource(db, resource, user, payload)


def update_resource(db: Session, resource: str, record_id: int, user: dict, payload: dict) -> dict:
    return resource_service.update_resource(db, resource, record_id, user, payload)


def delete_resource(db: Session, resource: str, record_id: int, user: dict) -> dict:
    return resource_service.delete_resource(db, resource, record_id, user)


def update_status(db: Session, resource: str, record_id: int, user: dict, status_value: int) -> dict:
    return resource_service.update_status(db, resource, record_id, user, status_value)
