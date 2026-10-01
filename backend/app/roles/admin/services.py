from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.db_helpers import rows_to_dicts


def admin_overview(db: Session) -> dict:
    rows = db.execute(text('SELECT id, empid, fname, email, position, status FROM "emp_details" ORDER BY id DESC LIMIT 10')).all()
    return {"recentEmployees": rows_to_dicts(rows)}
