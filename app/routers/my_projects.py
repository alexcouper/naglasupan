from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import Project, ProjectStatus, Tag, User
from app.schemas import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/my/projects", tags=["My Projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_my_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
    )
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    return projects


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify that all tag IDs exist
    tag_result = await db.execute(
        select(Tag).where(Tag.id.in_(project_data.tag_ids))
    )
    tags = tag_result.scalars().all()
    
    if len(tags) != len(project_data.tag_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more tag IDs are invalid"
        )
    
    # Get current month for submission tracking
    current_month = datetime.now().strftime("%Y-%m")
    
    # Create new project
    new_project = Project(
        title=project_data.title,
        description=project_data.description,
        long_description=project_data.long_description,
        website_url=str(project_data.website_url),
        github_url=str(project_data.github_url) if project_data.github_url else None,
        demo_url=str(project_data.demo_url) if project_data.demo_url else None,
        screenshot_urls=[str(url) for url in project_data.screenshot_urls],
        tech_stack=project_data.tech_stack,
        owner_id=current_user.id,
        submission_month=current_month,
        tags=tags
    )
    
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project, ["owner", "tags"])
    
    return new_project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_my_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(
            and_(
                Project.id == project_id,
                Project.owner_id == current_user.id
            )
        )
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get the project
    query = (
        select(Project)
        .options(selectinload(Project.tags))
        .where(
            and_(
                Project.id == project_id,
                Project.owner_id == current_user.id
            )
        )
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Only allow updates if project is pending or rejected
    if project.status == ProjectStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update approved projects"
        )
    
    # Verify that all tag IDs exist
    tag_result = await db.execute(
        select(Tag).where(Tag.id.in_(project_data.tag_ids))
    )
    tags = tag_result.scalars().all()
    
    if len(tags) != len(project_data.tag_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more tag IDs are invalid"
        )
    
    # Update project fields
    project.title = project_data.title
    project.description = project_data.description
    project.long_description = project_data.long_description
    project.website_url = str(project_data.website_url)
    project.github_url = str(project_data.github_url) if project_data.github_url else None
    project.demo_url = str(project_data.demo_url) if project_data.demo_url else None
    project.screenshot_urls = [str(url) for url in project_data.screenshot_urls]
    project.tech_stack = project_data.tech_stack
    project.tags = tags
    
    # Reset status to pending if it was rejected
    if project.status == ProjectStatus.REJECTED:
        project.status = ProjectStatus.PENDING
        project.rejection_reason = None
    
    await db.commit()
    await db.refresh(project, ["owner", "tags"])
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Project).where(
        and_(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Only allow deletion if project is pending or rejected
    if project.status == ProjectStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete approved projects"
        )
    
    await db.delete(project)
    await db.commit()


@router.post("/{project_id}/resubmit", response_model=ProjectResponse)
async def resubmit_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(
            and_(
                Project.id == project_id,
                Project.owner_id == current_user.id
            )
        )
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Only allow resubmission if project is rejected
    if project.status != ProjectStatus.REJECTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only rejected projects can be resubmitted"
        )
    
    # Reset project status
    project.status = ProjectStatus.PENDING
    project.rejection_reason = None
    
    await db.commit()
    await db.refresh(project)
    
    return project