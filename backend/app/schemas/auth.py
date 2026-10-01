from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str
    remember: bool = False


class PasswordChangeRequest(BaseModel):
    currentPassword: str
    newPassword: str
    renewPassword: str
