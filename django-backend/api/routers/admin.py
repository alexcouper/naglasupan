from ninja import Router, Query
from typing import List, Optional
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from math import ceil

from apps.projects.models import Project, ProjectStatus
from apps.tags.models import Tag
from api.schemas.project import AdminProjectResponse, ProjectApproval, ProjectListResponse
from api.schemas.user import UserResponse
from api.schemas.tag import TagCreate, TagResponse
from api.auth.security import auth, require_admin

User = get_user_model()
router = Router()


# Project Management
@router.get("/projects", response=ProjectListResponse, auth=auth, tags=["Admin"])
def list_all_projects(
    request,
    status_filter: Optional[ProjectStatus] = Query(None),
    page: int = Query(1),
    per_page: int = Query(20)
):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    queryset = Project.objects.select_related('owner').prefetch_related('tags')
    
    if status_filter:
        queryset = queryset.filter(status=status_filter)
    
    queryset = queryset.order_by('-created_at')
    
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


@router.get("/projects/{project_id}", response=AdminProjectResponse, auth=auth, tags=["Admin"])
def get_project_for_review(request, project_id: str):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    project = get_object_or_404(
        Project.objects.select_related('owner', 'approved_by').prefetch_related('tags'),
        id=project_id
    )
    return project


@router.put("/projects/{project_id}/approve", response=AdminProjectResponse, auth=auth, tags=["Admin"])
def approve_project(request, project_id: str, payload: ProjectApproval):
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


@router.put("/projects/{project_id}/feature", response=AdminProjectResponse, auth=auth, tags=["Admin"])
def toggle_project_featured(request, project_id: str):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    project = get_object_or_404(Project, id=project_id)
    project.is_featured = not project.is_featured
    project.save()
    return project


# User Management
@router.get("/users", response=List[UserResponse], auth=auth, tags=["Admin"])
def list_users(request, page: int = Query(1), per_page: int = Query(50)):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    offset = (page - 1) * per_page
    users = User.objects.all().order_by('-created_at')[offset:offset + per_page]
    return users


@router.put("/users/{user_id}/ban", response=UserResponse, auth=auth, tags=["Admin"])
def toggle_user_ban(request, user_id: str):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    user = get_object_or_404(User, id=user_id)
    user.is_active = not user.is_active
    user.save()
    return user


# Tag Management
@router.post("/tags", response=TagResponse, auth=auth, tags=["Admin"])
def create_tag(request, payload: TagCreate):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    if Tag.objects.filter(name=payload.name).exists():
        return 400, {"detail": "Tag with this name already exists"}
    
    if Tag.objects.filter(slug=payload.slug).exists():
        return 400, {"detail": "Tag with this slug already exists"}
    
    tag = Tag.objects.create(**payload.dict())
    return 201, tag


@router.put("/tags/{tag_id}", response=TagResponse, auth=auth, tags=["Admin"])
def update_tag(request, tag_id: str, payload: TagCreate):
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


@router.delete("/tags/{tag_id}", auth=auth, tags=["Admin"])
def delete_tag(request, tag_id: str):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    tag = get_object_or_404(Tag, id=tag_id)
    tag.delete()
    return 204, None


# Analytics
@router.get("/analytics", auth=auth, tags=["Admin"])
def get_platform_analytics(request):
    if not require_admin(request.auth):
        return 403, {"detail": "Admin access required"}
    
    from django.db.models import Count
    
    # Basic counts
    total_projects = Project.objects.count()
    pending_projects = Project.objects.filter(status=ProjectStatus.PENDING).count()
    approved_projects = Project.objects.filter(status=ProjectStatus.APPROVED).count()
    total_users = User.objects.count()
    
    # Monthly submissions
    monthly_submissions = {}
    for project in Project.objects.values('submission_month').annotate(count=Count('id')):
        monthly_submissions[project['submission_month']] = project['count']
    
    # Top tags
    top_tags = []
    for tag in Tag.objects.annotate(project_count=Count('projects')).order_by('-project_count')[:10]:
        top_tags.append({
            'name': tag.name,
            'count': tag.project_count
        })
    
    # Top tech stack (simplified)
    tech_counts = {}
    for project in Project.objects.all():
        for tech in project.tech_stack:
            tech_counts[tech] = tech_counts.get(tech, 0) + 1
    
    top_tech_stack = [
        {'name': tech, 'count': count}
        for tech, count in sorted(tech_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    return {
        "total_projects": total_projects,
        "pending_projects": pending_projects,
        "approved_projects": approved_projects,
        "total_users": total_users,
        "monthly_submissions": monthly_submissions,
        "top_tags": top_tags,
        "top_tech_stack": top_tech_stack
    }