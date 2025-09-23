from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func

from app.core.common.id_generator import generate_user_id
from app.integration.db.postgres import Base


# ---------- Request Schemas ----------
class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str = "user"


class SigninRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


# ---------- Response Schemas ----------
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # ✅ allows Pydantic to read ORM objects directly


class SigninResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

    class Config:
        orm_mode = True  # ✅ since it includes UserResponse from ORM


class SignupResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict] = None  # you had dict, but better typed Dict

    class Config:
        orm_mode = True


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_user_id, index=True)
    role = Column(String, nullable=False, default="user")  # admin/user
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(
        String, nullable=False
    )  # store only hashed password/ this use passlib which autio genrate randome salt, and add it to hashed string
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
