from sqlalchemy.orm import Session

from app.roles.admin import services


def overview(db: Session) -> dict:
    return services.admin_overview(db)
