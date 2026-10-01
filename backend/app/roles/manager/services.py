from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.db_helpers import rows_to_dicts


def manager_team(db: Session, user: dict) -> dict:
    rows = db.execute(
        text('SELECT id, empid, fname, email, position, status FROM "emp_details" WHERE report_manager_id = :manager_id ORDER BY fname'),
        {"manager_id": user.get("empid")},
    ).all()
    return {"team": rows_to_dicts(rows)}
