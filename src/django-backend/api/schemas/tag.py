from ninja import Schema
from typing import Optional
from uuid import UUID


class TagCreate(Schema):
    name: str
    slug: str
    description: Optional[str] = None
    color: Optional[str] = None


class TagResponse(Schema):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    color: Optional[str]