from datetime import timedelta

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.utils.dates import now_ist

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(raw_password: str, stored_password: str | None) -> bool:
    if not stored_password:
        return False
    if stored_password.startswith("$2"):
        return password_context.verify(raw_password, stored_password)
    return raw_password == stored_password


def hash_password(raw_password: str) -> str:
    return password_context.hash(raw_password)


def create_access_token(payload: dict) -> str:
    expires_at = now_ist() + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({**payload, "exp": expires_at}, settings.jwt_secret, algorithm=settings.jwt_algorithm)
