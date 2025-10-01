from datetime import datetime
from typing import List, Optional, Dict, Union
from uuid import UUID
from pydantic import BaseModel, HttpUrl, Field

from app.models.project import ProjectStatus
from .user import UserResponse
from .tag import TagResponse


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=500)
    long_description: Optional[str] = Field(None, max_length=5000)
    website_url: HttpUrl
    github_url: Optional[HttpUrl] = None
    demo_url: Optional[HttpUrl] = None
    screenshot_urls: List[HttpUrl] = Field(default_factory=list, max_length=5)
    tech_stack: List[str] = Field(..., min_length=1, max_length=10)
    tag_ids: List[UUID] = Field(..., min_length=1, max_length=5)


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: str
    long_description: Optional[str]
    website_url: str
    github_url: Optional[str]
    demo_url: Optional[str]
    screenshot_urls: List[str]
    tech_stack: List[str]
    monthly_visitors: int
    status: ProjectStatus
    is_featured: bool
    created_at: datetime
    approved_at: Optional[datetime]
    owner: UserResponse
    tags: List[TagResponse]
    
    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int
    page: int
    per_page: int
    pages: int


class ProjectFilters(BaseModel):
    tags: Optional[List[str]] = None  # Tag slugs
    tech_stack: Optional[List[str]] = None
    sort_by: Optional[str] = Field("created_at", pattern="^(created_at|monthly_visitors|title)$")
    sort_order: Optional[str] = Field("desc", pattern="^(asc|desc)$")
    search: Optional[str] = None
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)


class AdminProjectResponse(ProjectResponse):
    rejection_reason: Optional[str]
    approved_by: Optional[UserResponse]
    submission_month: str
    
    class Config:
        from_attributes = True


class ProjectApproval(BaseModel):
    approved: bool
    rejection_reason: Optional[str] = None
    is_featured: bool = False