from uuid import UUID

from ninja import Schema


class TagCreate(Schema):
    name: str
    slug: str
    description: str | None = None
    color: str | None = None


class TagResponse(Schema):
    id: UUID
    name: str
    slug: str
    description: str | None
    color: str | None
