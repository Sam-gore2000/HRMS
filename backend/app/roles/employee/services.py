from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.db_helpers import row_to_dict


def employee_home(db: Session, user: dict) -> dict:
    row = db.execute(text('SELECT * FROM "emp_details" WHERE empid = :empid LIMIT 1'), {"empid": user.get("empid")}).mappings().first()
    return {"profile": row_to_dict(row)}
