from random import randint

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, PasswordChangeRequest
from app.services.db_helpers import row_to_dict
from app.utils.dates import now_ist, today_ist
from app.utils.security import create_access_token, hash_password, verify_password


def _make_user_payload(row: dict, role: str, session_id: int | None = None) -> dict:
    empid = row.get("empid") or row.get("username")
    return {
        "sub": str(row.get("id") or empid),
        "username": row.get("username") or empid,
        "empid": empid,
        "name": row.get("fname") or row.get("username") or empid,
        "role": role,
        "session_id": session_id,
    }


def login(db: Session, payload: LoginRequest) -> dict:
    admin = db.execute(
        text('SELECT id, username, password, email FROM "admin" WHERE username = :username LIMIT 1'),
        {"username": payload.username},
    ).mappings().first()
    if admin and verify_password(payload.password, admin.get("password")):
        user = _make_user_payload(dict(admin), "admin")
        return {"token": create_access_token(user), "user": {k: v for k, v in user.items() if k != "sub"}}

    employee = db.execute(
        text('SELECT * FROM "emp_details" WHERE empid = :username OR username = :username LIMIT 1'),
        {"username": payload.username},
    ).mappings().first()
    if not employee or not verify_password(payload.password, employee.get("pass")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    employee_dict = dict(employee)
    role = "manager" if "manager" in str(employee_dict.get("position", "")).lower() else "employee"
    session_id = randint(1000000, 9999999)
    now = now_ist()
    db.execute(
        text('INSERT INTO "user_log" (session_id, emp_id, date, in_timestamp, status) VALUES (:session_id, :emp_id, :date, :in_timestamp, :status)'),
        {"session_id": session_id, "emp_id": employee_dict.get("empid"), "date": today_ist(), "in_timestamp": now.time(), "status": "Online"},
    )
    db.execute(text('UPDATE "emp_details" SET status = :status WHERE empid = :empid'), {"status": "Online", "empid": employee_dict.get("empid")})
    db.commit()
    user = _make_user_payload(employee_dict, role, session_id=session_id)
    return {"token": create_access_token(user), "user": {k: v for k, v in user.items() if k != "sub"}}


def logout(db: Session, user: dict) -> dict:
    now = now_ist()
    if user.get("session_id"):
        db.execute(
            text('UPDATE "user_log" SET out_timestamp = :out_timestamp, status = :status WHERE session_id = :session_id'),
            {"out_timestamp": now.time(), "status": "Offline", "session_id": user["session_id"]},
        )
    if user.get("empid"):
        db.execute(text('UPDATE "emp_details" SET status = :status WHERE empid = :empid'), {"status": "Offline", "empid": user["empid"]})
    db.commit()
    return {"message": "Logged out"}


def update_profile(db: Session, user: dict, payload: dict) -> dict:
    allowed = ["fname", "about", "department", "position", "add", "phno", "email", "twitter", "facebook", "instagram", "linkedin"]
    updates = {key: value for key, value in payload.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=400, detail="No profile fields supplied")
    set_clause = ", ".join(f'"{key}" = :{key}' for key in updates)
    updates["empid"] = user.get("empid")
    db.execute(text(f'UPDATE "emp_details" SET {set_clause} WHERE empid = :empid'), updates)
    db.commit()
    row = db.execute(text('SELECT * FROM "emp_details" WHERE empid = :empid'), {"empid": user.get("empid")}).mappings().first()
    return {"data": row_to_dict(row)}


def change_password(db: Session, user: dict, payload: PasswordChangeRequest) -> dict:
    if payload.newPassword != payload.renewPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    row = db.execute(text('SELECT id, "pass" FROM "emp_details" WHERE empid = :empid LIMIT 1'), {"empid": user.get("empid")}).mappings().first()
    if not row or not verify_password(payload.currentPassword, row.get("pass")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    db.execute(text('UPDATE "emp_details" SET "pass" = :password WHERE empid = :empid'), {"password": hash_password(payload.newPassword), "empid": user.get("empid")})
    db.commit()
    return {"message": "Password changed successfully"}
