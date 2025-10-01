from ninja import Router
from typing import List
from django.utils import timezone
from django.shortcuts import get_object_or_404

from apps.projects.models import Project, ProjectStatus
from apps.tags.models import Tag
from api.schemas.project import ProjectCreate, ProjectResponse
from api.auth.security import auth

router = Router()


@router.get("", response=List[ProjectResponse], auth=auth, tags=["My Projects"])
def list_my_projects(request):
    projects = Project.objects.filter(owner=request.auth).select_related('owner').prefetch_related('tags')
    return projects


@router.post("", response=ProjectResponse, auth=auth, tags=["My Projects"])
def create_project(request, payload: ProjectCreate):
    # Validate tag IDs exist
    tag_ids = payload.tag_ids
    if len(tag_ids) != Tag.objects.filter(id__in=tag_ids).count():
        return 400, {"detail": "One or more tag IDs are invalid"}
    
    # Create project
    project_data = payload.dict(exclude={'tag_ids'})
    project = Project.objects.create(owner=request.auth, **project_data)
    
    # Add tags
    tags = Tag.objects.filter(id__in=tag_ids)
    project.tags.set(tags)
    
    return 201, project


@router.get("/{project_id}", response=ProjectResponse, auth=auth, tags=["My Projects"])
def get_my_project(request, project_id: str):
    project = get_object_or_404(
        Project.objects.select_related('owner').prefetch_related('tags'),
        id=project_id,
        owner=request.auth
    )
    return project


@router.put("/{project_id}", response=ProjectResponse, auth=auth, tags=["My Projects"])
def update_project(request, project_id: str, payload: ProjectCreate):
    project = get_object_or_404(Project, id=project_id, owner=request.auth)
    
    # Validate tag IDs exist
    tag_ids = payload.tag_ids
    if len(tag_ids) != Tag.objects.filter(id__in=tag_ids).count():
        return 400, {"detail": "One or more tag IDs are invalid"}
    
    # Update project
    project_data = payload.dict(exclude={'tag_ids'})
    for field, value in project_data.items():
        setattr(project, field, value)
    
    # Reset status to pending if it was previously rejected
    if project.status == ProjectStatus.REJECTED:
        project.status = ProjectStatus.PENDING
        project.rejection_reason = None
    
    project.save()
    
    # Update tags
    tags = Tag.objects.filter(id__in=tag_ids)
    project.tags.set(tags)
    
    return project


@router.delete("/{project_id}", auth=auth, tags=["My Projects"])
def delete_project(request, project_id: str):
    project = get_object_or_404(Project, id=project_id, owner=request.auth)
    project.delete()
    return 204, None


@router.post("/{project_id}/resubmit", response=ProjectResponse, auth=auth, tags=["My Projects"])
def resubmit_project(request, project_id: str):
    project = get_object_or_404(Project, id=project_id, owner=request.auth)
    
    if project.status != ProjectStatus.REJECTED:
        return 400, {"detail": "Only rejected projects can be resubmitted"}
    
    project.status = ProjectStatus.PENDING
    project.rejection_reason = None
    project.save()
    
    return project