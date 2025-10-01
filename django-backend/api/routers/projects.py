from ninja import Router, Query
from typing import List, Optional
from django.db.models import Q
from django.utils import timezone
from math import ceil

from apps.projects.models import Project, ProjectStatus
from apps.tags.models import Tag
from api.schemas.project import ProjectResponse, ProjectListResponse
from api.schemas.errors import Error
from api.auth.security import auth

router = Router()


@router.get("", response={200: ProjectListResponse}, tags=["Projects"])
def list_projects(
    request,
    tags: Optional[List[str]] = Query(None),
    tech_stack: Optional[List[str]] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    search: Optional[str] = Query(None),
    page: int = Query(1),
    per_page: int = Query(20)
):
    # Start with approved projects only
    queryset = Project.objects.filter(status=ProjectStatus.APPROVED).select_related('owner').prefetch_related('tags')
    
    # Apply filters
    if tags:
        queryset = queryset.filter(tags__slug__in=tags).distinct()
    
    if tech_stack:
        for tech in tech_stack:
            queryset = queryset.filter(tech_stack__icontains=tech)
    
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search)
        )
    
    # Apply sorting
    if sort_order == "desc":
        sort_by = f"-{sort_by}"
    queryset = queryset.order_by(sort_by)
    
    # Pagination
    total = queryset.count()
    pages = ceil(total / per_page)
    offset = (page - 1) * per_page
    projects = queryset[offset:offset + per_page]
    
    return {
        "projects": projects,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages
    }


@router.get("/featured", response={200: List[ProjectResponse]}, tags=["Projects"])
def get_featured_projects(request):
    projects = Project.objects.filter(
        status=ProjectStatus.APPROVED,
        is_featured=True
    ).select_related('owner').prefetch_related('tags')[:10]
    return projects


@router.get("/trending", response={200: List[ProjectResponse]}, tags=["Projects"])
def get_trending_projects(request):
    # Get projects sorted by monthly visitors
    projects = Project.objects.filter(
        status=ProjectStatus.APPROVED
    ).select_related('owner').prefetch_related('tags').order_by('-monthly_visitors')[:10]
    return projects


@router.get("/{project_id}", response={200: ProjectResponse, 401: Error, 404: Error}, auth=auth, tags=["Projects"])
def get_project(request, project_id: str):
    project = Project.objects.select_related('owner').prefetch_related('tags').get(id=project_id)
    
    # Only show approved projects unless owner or admin
    if project.status != ProjectStatus.APPROVED and project.owner != request.auth and not request.auth.is_superuser:
        return 404, {"detail": "Project not found"}
    
    return project