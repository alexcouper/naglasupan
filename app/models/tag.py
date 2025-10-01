from sqlalchemy import Column, String, ForeignKey, Table, UUID
from sqlalchemy.orm import relationship
from .base import BaseModel, Base

# Association table for many-to-many relationship between projects and tags
ProjectTag = Table(
    'project_tags',
    Base.metadata,
    Column('project_id', UUID(as_uuid=True), ForeignKey('projects.id'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'), primary_key=True)
)


class Tag(BaseModel):
    __tablename__ = "tags"
    
    name = Column(String, unique=True, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(String)
    color = Column(String)  # Hex color code
    
    # Relationships
    projects = relationship("Project", secondary=ProjectTag, back_populates="tags")