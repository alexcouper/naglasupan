from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import Tag
from app.schemas import TagResponse

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.get("", response_model=List[TagResponse])
async def list_tags(db: AsyncSession = Depends(get_db)):
    query = select(Tag).order_by(Tag.name)
    result = await db.execute(query)
    tags = result.scalars().all()
    return tags