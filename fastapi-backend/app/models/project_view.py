from sqlalchemy import Column, String, ForeignKey, DateTime, UUID
from sqlalchemy.orm import relationship
from .base import BaseModel


class ProjectView(BaseModel):
    __tablename__ = "project_views"
    
    ip_address = Column(String, nullable=False)  # Will be hashed for privacy
    user_agent = Column(String)
    referrer = Column(String)
    session_id = Column(String)
    viewed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # Foreign Keys
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False, index=True)
    
    # Relationships
    project = relationship("Project", back_populates="views")