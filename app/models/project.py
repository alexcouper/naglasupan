import enum
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, Enum, ForeignKey, UUID, JSON
from sqlalchemy.orm import relationship
from .base import BaseModel


class ProjectStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Project(BaseModel):
    __tablename__ = "projects"
    
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    long_description = Column(Text)
    website_url = Column(String, nullable=False)
    github_url = Column(String)
    demo_url = Column(String)
    screenshot_urls = Column(JSON, default=list)
    tech_stack = Column(JSON, nullable=False)
    monthly_visitors = Column(Integer, default=0, nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PENDING, nullable=False, index=True)
    rejection_reason = Column(Text)
    is_featured = Column(Boolean, default=False, nullable=False)
    submission_month = Column(String, nullable=False, index=True)  # YYYY-MM format
    approved_at = Column(DateTime(timezone=True))
    
    # Foreign Keys
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Relationships
    owner = relationship("User", back_populates="projects", foreign_keys=[owner_id])
    approver = relationship("User", foreign_keys=[approved_by])
    tags = relationship("Tag", secondary="project_tags", back_populates="projects")
    views = relationship("ProjectView", back_populates="project")
    
    # Indexes
    __table_args__ = (
        # Add composite indexes for better query performance
    )