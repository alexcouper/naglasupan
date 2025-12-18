from datetime import datetime
from typing import Optional
from uuid import UUID

from ninja import Schema


class UserCreate(Schema):
    email: str
    password: str
    kennitala: str
    first_name: str = ""
    last_name: str = ""


class UserResponse(Schema):
    id: UUID
    email: str
    first_name: str
    last_name: str
    kennitala: str | None
    is_verified: bool
    created_at: datetime


class UserUpdate(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
