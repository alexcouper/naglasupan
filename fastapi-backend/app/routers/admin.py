import math
from datetime import datetime
from typing import List, Optional, Dict, Union
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_, update
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models import Project, ProjectStatus, Tag, User
from app.schemas import (
    AdminProjectResponse, 
    ProjectApproval, 
    ProjectListResponse,
    TagCreate,
    TagResponse,
    UserResponse,
    PlatformAnalytics
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/projects", response_model=ProjectListResponse)
async def list_all_projects(
    status_filter: Optional[ProjectStatus] = Query(None, description="Filter by project status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags),
            selectinload(Project.approver)
        )
    )
    
    if status_filter:
        query = query.where(Project.status == status_filter)
    
    query = query.order_by(desc(Project.created_at))
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    result = await db.execute(count_query)
    total = result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    pages = math.ceil(total / per_page)
    
    return ProjectListResponse(
        projects=projects,
        total=total,
        page=page,
        per_page=per_page,
        pages=pages
    )


@router.get("/projects/{project_id}", response_model=AdminProjectResponse)
async def get_project_for_review(
    project_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags),
            selectinload(Project.approver)
        )
        .where(Project.id == project_id)
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/projects/{project_id}/approve", response_model=AdminProjectResponse)
async def approve_project(
    project_id: UUID,
    approval_data: ProjectApproval,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(Project.id == project_id)
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if approval_data.approved:
        project.status = ProjectStatus.APPROVED
        project.approved_by = current_admin.id
        project.approved_at = datetime.utcnow()
        project.rejection_reason = None
        project.is_featured = approval_data.is_featured
    else:
        if not approval_data.rejection_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rejection reason is required when rejecting a project"
            )
        project.status = ProjectStatus.REJECTED
        project.rejection_reason = approval_data.rejection_reason
        project.approved_by = None
        project.approved_at = None
        project.is_featured = False
    
    await db.commit()
    await db.refresh(project, ["owner", "tags", "approver"])
    
    return project


@router.put("/projects/{project_id}/feature", response_model=AdminProjectResponse)
async def toggle_project_featured(
    project_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(Project.id == project_id)
    )
    
    result = await db.execute(query)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.status != ProjectStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only approved projects can be featured"
        )
    
    project.is_featured = not project.is_featured
    
    await db.commit()
    await db.refresh(project)
    
    return project


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * per_page
    
    query = (
        select(User)
        .order_by(desc(User.created_at))
        .offset(offset)
        .limit(per_page)
    )
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    return users


@router.put("/users/{user_id}/ban", response_model=UserResponse)
async def toggle_user_ban(
    user_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot ban yourself"
        )
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = not user.is_active
    
    await db.commit()
    await db.refresh(user)
    
    return user


@router.post("/tags", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreate,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Check if tag already exists
    result = await db.execute(
        select(Tag).where(
            (Tag.name == tag_data.name) | (Tag.slug == tag_data.slug)
        )
    )
    existing_tag = result.scalar_one_or_none()
    
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tag with this name or slug already exists"
        )
    
    new_tag = Tag(
        name=tag_data.name,
        slug=tag_data.slug,
        description=tag_data.description,
        color=tag_data.color
    )
    
    db.add(new_tag)
    await db.commit()
    await db.refresh(new_tag)
    
    return new_tag


@router.put("/tags/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: UUID,
    tag_data: TagCreate,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tag).where(Tag.id == tag_id))
    tag = result.scalar_one_or_none()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    # Check if name/slug conflicts with other tags
    result = await db.execute(
        select(Tag).where(
            and_(
                Tag.id != tag_id,
                (Tag.name == tag_data.name) | (Tag.slug == tag_data.slug)
            )
        )
    )
    existing_tag = result.scalar_one_or_none()
    
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tag with this name or slug already exists"
        )
    
    tag.name = tag_data.name
    tag.slug = tag_data.slug
    tag.description = tag_data.description
    tag.color = tag_data.color
    
    await db.commit()
    await db.refresh(tag)
    
    return tag


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Tag).where(Tag.id == tag_id))
    tag = result.scalar_one_or_none()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    await db.delete(tag)
    await db.commit()


@router.get("/analytics", response_model=PlatformAnalytics)
async def get_platform_analytics(
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Get project counts by status
    project_counts = await db.execute(
        select(Project.status, func.count(Project.id))
        .group_by(Project.status)
    )
    status_counts = {status: count for status, count in project_counts.fetchall()}
    
    # Get total users
    user_count = await db.execute(select(func.count(User.id)))
    total_users = user_count.scalar()
    
    # Get monthly submissions (last 12 months)
    monthly_submissions = await db.execute(
        select(Project.submission_month, func.count(Project.id))
        .group_by(Project.submission_month)
        .order_by(desc(Project.submission_month))
        .limit(12)
    )
    monthly_data = {month: count for month, count in monthly_submissions.fetchall()}
    
    # Get top tags (by project count)
    top_tags = await db.execute(
        select(Tag.name, func.count(Project.id))
        .join(Project.tags)
        .group_by(Tag.name)
        .order_by(desc(func.count(Project.id)))
        .limit(10)
    )
    top_tags_data = [{"name": name, "count": count} for name, count in top_tags.fetchall()]
    
    return PlatformAnalytics(
        total_projects=sum(status_counts.values()),
        pending_projects=status_counts.get(ProjectStatus.PENDING, 0),
        approved_projects=status_counts.get(ProjectStatus.APPROVED, 0),
        total_users=total_users,
        monthly_submissions=monthly_data,
        top_tags=top_tags_data,
        top_tech_stack=[]  # Would need more complex query for tech stack analysis
    )