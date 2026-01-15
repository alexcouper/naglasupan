from datetime import datetime
from typing import Any
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
    groups: list[str]

    @staticmethod
    def resolve_groups(obj: Any) -> list[str]:
        return list(obj.groups.values_list("name", flat=True))


class UserUpdate(Schema):
    first_name: str | None = None
    last_name: str | None = None
