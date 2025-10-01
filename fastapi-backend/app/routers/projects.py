import math
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, and_, or_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user_optional
from app.models import Project, ProjectStatus, Tag, User
from app.schemas import ProjectResponse, ProjectListResponse, ProjectFilters

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    tags: Optional[List[str]] = Query(None, description="Filter by tag slugs"),
    tech_stack: Optional[List[str]] = Query(None, description="Filter by tech stack"),
    sort_by: str = Query("created_at", regex="^(created_at|monthly_visitors|title)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    # Base query for approved projects only
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(Project.status == ProjectStatus.APPROVED)
    )
    
    # Apply filters
    filters = []
    
    if tags:
        query = query.join(Project.tags).where(Tag.slug.in_(tags))
    
    if tech_stack:
        # Filter by tech stack (JSON contains any of the specified technologies)
        tech_conditions = [
            Project.tech_stack.op('?')(tech) for tech in tech_stack
        ]
        filters.append(or_(*tech_conditions))
    
    if search:
        search_term = f"%{search}%"
        filters.append(
            or_(
                Project.title.ilike(search_term),
                Project.description.ilike(search_term)
            )
        )
    
    if filters:
        query = query.where(and_(*filters))
    
    # Apply sorting
    if sort_by == "created_at":
        sort_column = Project.created_at
    elif sort_by == "monthly_visitors":
        sort_column = Project.monthly_visitors
    elif sort_by == "title":
        sort_column = Project.title
    
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Get total count for pagination
    count_query = select(func.count()).select_from(query.subquery())
    result = await db.execute(count_query)
    total = result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    # Execute query
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


@router.get("/featured", response_model=List[ProjectResponse])
async def get_featured_projects(db: AsyncSession = Depends(get_db)):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(
            and_(
                Project.status == ProjectStatus.APPROVED,
                Project.is_featured == True
            )
        )
        .order_by(desc(Project.created_at))
        .limit(10)
    )
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    return projects


@router.get("/trending", response_model=List[ProjectResponse])
async def get_trending_projects(db: AsyncSession = Depends(get_db)):
    query = (
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.tags)
        )
        .where(Project.status == ProjectStatus.APPROVED)
        .order_by(desc(Project.monthly_visitors))
        .limit(10)
    )
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
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
    
    # Only show approved projects to non-owners
    if (project.status != ProjectStatus.APPROVED and 
        (not current_user or 
         (project.owner_id != current_user.id and not current_user.is_superuser))):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project