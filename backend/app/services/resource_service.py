from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.registry import ResourceConfig, get_resource_config
from app.services.db_helpers import quote_name, row_to_dict, rows_to_dicts

WRITE_RESOURCES = {"leaves", "queries", "attendanceRequests", "dprs", "timesheets", "meetings"}
ADMIN_MANAGER_STATUS = {"leaves", "queries", "attendanceRequests"}


def _scope_clause(config: ResourceConfig, user: dict, params: dict) -> str:
    role = user.get("role")
    if role == "admin":
        return ""
    if role == "manager" and config.manager_column:
        params["manager_id"] = user.get("empid")
        return f' AND {quote_name(config.manager_column)} = :manager_id'
    if config.owner_column:
        params["owner_id"] = user.get("empid")
        return f' AND {quote_name(config.owner_column)} = :owner_id'
    return ""


def _assert_can_write(resource: str, user: dict) -> None:
    if user.get("role") == "admin":
        return
    if resource in WRITE_RESOURCES:
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot change this resource")


def list_resource(db: Session, resource: str, user: dict, q: str | None = None) -> dict:
    try:
        config = get_resource_config(resource)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Resource not found") from exc

    params: dict = {}
    where_parts = ["1 = 1"]
    if q:
        params["q"] = f"%{q.lower()}%"
        search = " OR ".join(f'LOWER(CAST({quote_name(column)} AS TEXT)) LIKE :q' for column in config.searchable)
        where_parts.append(f"({search})")
    scope = _scope_clause(config, user, params)
    where_sql = " AND ".join(where_parts) + scope
    sql = f'SELECT * FROM {quote_name(config.table)} WHERE {where_sql} ORDER BY id DESC LIMIT 500'
    rows = db.execute(text(sql), params).all()
    return {"title": config.title, "columns": list(config.columns), "data": rows_to_dicts(rows)}


def create_resource(db: Session, resource: str, user: dict, payload: dict) -> dict:
    config = get_resource_config(resource)
    _assert_can_write(resource, user)
    data = {key: value for key, value in payload.items() if key != "id" and value != ""}
    if user.get("role") == "employee" and config.owner_column and config.owner_column not in data:
        data[config.owner_column] = user.get("empid")
    if resource == "leaves" and data.get("leave1") and data.get("leave2"):
        start = date.fromisoformat(str(data["leave1"]))
        end = date.fromisoformat(str(data["leave2"]))
        data["total_leave"] = (end - start).days + 1
    if not data:
        raise HTTPException(status_code=400, detail="No data supplied")
    columns = ", ".join(quote_name(key) for key in data)
    values = ", ".join(f":{key}" for key in data)
    row = db.execute(text(f'INSERT INTO {quote_name(config.table)} ({columns}) VALUES ({values}) RETURNING *'), data).mappings().first()
    db.commit()
    return {"data": row_to_dict(row)}


def update_resource(db: Session, resource: str, record_id: int, user: dict, payload: dict) -> dict:
    config = get_resource_config(resource)
    if not config.mutable:
        raise HTTPException(status_code=403, detail="Resource is read only")
    _assert_can_write(resource, user)
    data = {key: value for key, value in payload.items() if key not in {"id", "_id"}}
    if not data:
        raise HTTPException(status_code=400, detail="No data supplied")
    params = {**data, "id": record_id}
    scope = _scope_clause(config, user, params)
    set_clause = ", ".join(f'{quote_name(key)} = :{key}' for key in data)
    row = db.execute(
        text(f'UPDATE {quote_name(config.table)} SET {set_clause} WHERE id = :id{scope} RETURNING *'),
        params,
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Record not found")
    db.commit()
    return {"data": row_to_dict(row)}


def delete_resource(db: Session, resource: str, record_id: int, user: dict) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete records")
    config = get_resource_config(resource)
    db.execute(text(f'DELETE FROM {quote_name(config.table)} WHERE id = :id'), {"id": record_id})
    db.commit()
    return {"message": "Record deleted"}


def update_status(db: Session, resource: str, record_id: int, user: dict, status_value: int) -> dict:
    if resource not in ADMIN_MANAGER_STATUS or user.get("role") not in {"admin", "manager"}:
        raise HTTPException(status_code=403, detail="You cannot update status for this resource")
    config = get_resource_config(resource)
    params = {"id": record_id, "status": status_value}
    scope = _scope_clause(config, user, params)
    row = db.execute(
        text(f'UPDATE {quote_name(config.table)} SET status = :status WHERE id = :id{scope} RETURNING *'),
        params,
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Record not found")
    db.commit()
    return {"data": row_to_dict(row)}
