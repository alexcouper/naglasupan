from datetime import datetime
from uuid import UUID

from ninja import Schema

from .tag import TagResponse
from .user import UserResponse


class ProjectCreate(Schema):
    website_url: str
    description: str | None = None
    # fields | None- will be filled by admin during review
    title: str | None = None
    long_description: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    screenshot_urls: list[str] | None = None
    tech_stack: list[str] | None = None
    tag_ids: list[UUID] | None = None


class ProjectResponse(Schema):
    id: UUID
    title: str
    description: str
    long_description: str | None
    website_url: str
    github_url: str | None
    demo_url: str | None
    screenshot_urls: list[str]
    tech_stack: list[str]
    monthly_visitors: int
    status: str
    is_featured: bool
    created_at: datetime
    approved_at: datetime | None
    owner: UserResponse
    tags: list[TagResponse]


class ProjectListResponse(Schema):
    projects: list[ProjectResponse]
    total: int
    page: int
    per_page: int
    pages: int


class AdminProjectResponse(ProjectResponse):
    rejection_reason: str | None
    approved_by: UserResponse | None
    submission_month: str


class ProjectApproval(Schema):
    approved: bool
    rejection_reason: str | None = None
    is_featured: bool = False