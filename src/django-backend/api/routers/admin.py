from __future__ import annotations

from math import ceil
from typing import TYPE_CHECKING, Any

from django.contrib.auth import get_user_model
from django.db.models import Count, QuerySet
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja import Query, Router

from api.auth.security import auth, require_admin
from api.schemas.errors import Error
from api.schemas.project import (
    AdminProjectResponse,
    ProjectApproval,
    ProjectListResponse,
)
from api.schemas.tag import TagCreate, TagResponse
from api.schemas.user import UserResponse
from apps.projects.models import Project, ProjectStatus
from apps.tags.models import Tag

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()
router = Router()


# Project Management
@router.get(
    "/projects",
    response={200: ProjectListResponse, 401: Error, 403: Error},
    auth=auth,
    tags=["Admin"],
)
def list_all_projects(
    request: HttpRequest,
    status_filter: ProjectStatus | None = Query(None),
    page: int = Query(1),
    per_page: int = Query(20),
) -> dict[str, Any] | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    queryset: QuerySet[Project] = Project.objects.select_related(
        "owner"
    ).prefetch_related("tags")

    if status_filter:
        queryset = queryset.filter(status=status_filter)

    queryset = queryset.order_by("-created_at")

    # Pagination
    total = queryset.count()
    pages = ceil(total / per_page)
    offset = (page - 1) * per_page
    projects = queryset[offset : offset + per_page]

    return {
        "projects": projects,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
    }


@router.get(
    "/projects/{project_id}",
    response={200: AdminProjectResponse, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def get_project_for_review(
    request: HttpRequest,
    project_id: str,
) -> Project | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    return get_object_or_404(
        Project.objects.select_related("owner", "approved_by").prefetch_related("tags"),
        id=project_id,
    )


@router.put(
    "/projects/{project_id}/approve",
    response={200: AdminProjectResponse, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def approve_project(
    request: HttpRequest,
    project_id: str,
    payload: ProjectApproval,
) -> Project | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    project = get_object_or_404(Project, id=project_id)

    if payload.approved:
        project.status = ProjectStatus.APPROVED
        project.approved_at = timezone.now()
        project.approved_by = request.auth
        project.rejection_reason = None
        project.is_featured = payload.is_featured
    else:
        project.status = ProjectStatus.REJECTED
        project.rejection_reason = payload.rejection_reason
        project.approved_at = None
        project.approved_by = None

    project.save()
    return project


@router.put(
    "/projects/{project_id}/feature",
    response={200: AdminProjectResponse, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def toggle_project_featured(
    request: HttpRequest,
    project_id: str,
) -> Project | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    project = get_object_or_404(Project, id=project_id)
    project.is_featured = not project.is_featured
    project.save()
    return project


# User Management
@router.get(
    "/users",
    response={200: list[UserResponse], 401: Error, 403: Error},
    auth=auth,
    tags=["Admin"],
)
def list_users(
    request: HttpRequest,
    page: int = Query(1),
    per_page: int = Query(50),
) -> QuerySet[AbstractUser] | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    offset = (page - 1) * per_page
    return User.objects.all().order_by("-created_at")[offset : offset + per_page]


@router.put(
    "/users/{user_id}/ban",
    response={200: UserResponse, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def toggle_user_ban(
    request: HttpRequest,
    user_id: str,
) -> AbstractUser | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    user = get_object_or_404(User, id=user_id)
    user.is_active = not user.is_active
    user.save()
    return user


# Tag Management
@router.post(
    "/tags",
    response={201: TagResponse, 400: Error, 401: Error, 403: Error},
    auth=auth,
    tags=["Admin"],
)
def create_tag(
    request: HttpRequest,
    payload: TagCreate,
) -> tuple[int, Tag | dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    if Tag.objects.filter(name=payload.name).exists():
        return 400, {"detail": "Tag with this name already exists"}

    if Tag.objects.filter(slug=payload.slug).exists():
        return 400, {"detail": "Tag with this slug already exists"}

    tag = Tag.objects.create(**payload.dict())
    return 201, tag


@router.put(
    "/tags/{tag_id}",
    response={200: TagResponse, 400: Error, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def update_tag(
    request: HttpRequest,
    tag_id: str,
    payload: TagCreate,
) -> Tag | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    tag = get_object_or_404(Tag, id=tag_id)

    # Check for duplicates excluding current tag
    if Tag.objects.filter(name=payload.name).exclude(id=tag_id).exists():
        return 400, {"detail": "Tag with this name already exists"}

    if Tag.objects.filter(slug=payload.slug).exclude(id=tag_id).exists():
        return 400, {"detail": "Tag with this slug already exists"}

    for field, value in payload.dict().items():
        setattr(tag, field, value)
    tag.save()

    return tag


@router.delete(
    "/tags/{tag_id}",
    response={204: None, 401: Error, 403: Error, 404: Error},
    auth=auth,
    tags=["Admin"],
)
def delete_tag(
    request: HttpRequest,
    tag_id: str,
) -> tuple[int, None | dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    tag = get_object_or_404(Tag, id=tag_id)
    tag.delete()
    return 204, None


# Analytics
@router.get(
    "/analytics",
    response={200: dict, 401: Error, 403: Error},
    auth=auth,
    tags=["Admin"],
)
def get_platform_analytics(
    request: HttpRequest,
) -> dict[str, Any] | tuple[int, dict[str, str]]:
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}

    # Basic counts
    total_projects = Project.objects.count()
    pending_projects = Project.objects.filter(status=ProjectStatus.PENDING).count()
    approved_projects = Project.objects.filter(status=ProjectStatus.APPROVED).count()
    total_users = User.objects.count()

    # Monthly submissions
    monthly_submissions = {
        project["submission_month"]: project["count"]
        for project in Project.objects.values("submission_month").annotate(
            count=Count("id"),
        )
    }

    # Top tags
    top_tags = [
        {"name": tag.name, "count": tag.project_count}
        for tag in Tag.objects.annotate(project_count=Count("projects")).order_by(
            "-project_count",
        )[:10]
    ]

    # Top tech stack (simplified)
    tech_counts: dict[str, int] = {}
    for project in Project.objects.all():
        for tech in project.tech_stack:
            tech_counts[tech] = tech_counts.get(tech, 0) + 1

    top_tech_stack = [
        {"name": tech, "count": count}
        for tech, count in sorted(
            tech_counts.items(),
            key=lambda x: x[1],
            reverse=True,
        )[:10]
    ]

    return {
        "total_projects": total_projects,
        "pending_projects": pending_projects,
        "approved_projects": approved_projects,
        "total_users": total_users,
        "monthly_submissions": monthly_submissions,
        "top_tags": top_tags,
        "top_tech_stack": top_tech_stack,
    }
