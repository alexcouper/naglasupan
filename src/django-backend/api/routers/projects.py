from math import ceil
from typing import Any

from django.db.models import Q, QuerySet
from django.http import HttpRequest
from ninja import Query, Router

from api.auth.security import optional_auth
from api.schemas.errors import Error
from api.schemas.project import ProjectListResponse, ProjectResponse
from apps.projects.models import Project, ProjectStatus

router = Router()


@router.get("", response={200: ProjectListResponse}, tags=["Projects"])
def list_projects(
    request: HttpRequest,
    tags: list[str] | None = Query(None),
    tech_stack: list[str] | None = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    search: str | None = Query(None),
    page: int = Query(1),
    per_page: int = Query(20),
) -> dict[str, Any]:
    # Start with approved projects only
    queryset: QuerySet[Project] = (
        Project.objects.filter(status=ProjectStatus.APPROVED)
        .select_related("owner")
        .prefetch_related("tags")
    )

    # Apply filters
    if tags:
        queryset = queryset.filter(tags__slug__in=tags).distinct()

    if tech_stack:
        for tech in tech_stack:
            queryset = queryset.filter(tech_stack__icontains=tech)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search),
        )

    # Apply sorting
    order_field = f"-{sort_by}" if sort_order == "desc" else sort_by
    queryset = queryset.order_by(order_field)

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


@router.get("/featured", response={200: list[ProjectResponse]}, tags=["Projects"])
def get_featured_projects(
    request: HttpRequest,
) -> QuerySet[Project]:
    return (
        Project.objects.filter(status=ProjectStatus.APPROVED, is_featured=True)
        .select_related("owner")
        .prefetch_related("tags")[:10]
    )


@router.get("/trending", response={200: list[ProjectResponse]}, tags=["Projects"])
def get_trending_projects(
    request: HttpRequest,
) -> QuerySet[Project]:
    # Get projects sorted by monthly visitors
    return (
        Project.objects.filter(status=ProjectStatus.APPROVED)
        .select_related("owner")
        .prefetch_related("tags")
        .order_by("-monthly_visitors")[:10]
    )


@router.get(
    "/{project_id}",
    response={200: ProjectResponse, 404: Error},
    auth=optional_auth,
    tags=["Projects"],
)
def get_project(
    request: HttpRequest,
    project_id: str,
) -> Project | tuple[int, dict[str, str]]:
    try:
        project = (
            Project.objects.select_related("owner")
            .prefetch_related("tags")
            .get(id=project_id)
        )
    except Project.DoesNotExist:
        return 404, {"detail": "Project not found"}

    # Approved projects are visible to everyone
    if project.status == ProjectStatus.APPROVED:
        return project

    # Non-approved projects only visible to owner or admin
    user = request.auth
    if user and (project.owner == user or user.is_superuser):
        return project

    return 404, {"detail": "Project not found"}
