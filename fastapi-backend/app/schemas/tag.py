from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class TagCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    slug: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=200)
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")


class TagResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    color: Optional[str]
    
    class Config:
        from_attributes = True