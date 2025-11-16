from ninja import Schema
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from apps.projects.models import ProjectStatus
from .user import UserResponse
from .tag import TagResponse


class ProjectCreate(Schema):
    url: str
    description: Optional[str] = None
    # Optional fields - will be filled by admin during review
    title: Optional[str] = None
    long_description: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    screenshot_urls: List[str] = []
    tech_stack: List[str] = []
    tag_ids: List[UUID] = []


class ProjectResponse(Schema):
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
    status: str
    is_featured: bool
    created_at: datetime
    approved_at: Optional[datetime]
    owner: UserResponse
    tags: List[TagResponse]


class ProjectListResponse(Schema):
    projects: List[ProjectResponse]
    total: int
    page: int
    per_page: int
    pages: int


class AdminProjectResponse(ProjectResponse):
    rejection_reason: Optional[str]
    approved_by: Optional[UserResponse]
    submission_month: str


class ProjectApproval(Schema):
    approved: bool
    rejection_reason: Optional[str] = None
    is_featured: bool = False