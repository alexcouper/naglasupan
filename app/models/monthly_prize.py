from sqlalchemy import Column, String, ForeignKey, DateTime, Numeric, UUID
from sqlalchemy.orm import relationship
from .base import BaseModel


class MonthlyPrize(BaseModel):
    __tablename__ = "monthly_prizes"
    
    month = Column(String, unique=True, nullable=False)  # YYYY-MM format
    prize_amount = Column(Numeric(10, 2))
    voting_end_date = Column(DateTime(timezone=True), nullable=False)
    winner_announced_at = Column(DateTime(timezone=True))
    
    # Foreign Keys
    winner_project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    runner_up_1_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    runner_up_2_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    
    # Relationships
    winner_project = relationship("Project", foreign_keys=[winner_project_id])
    runner_up_1 = relationship("Project", foreign_keys=[runner_up_1_id])
    runner_up_2 = relationship("Project", foreign_keys=[runner_up_2_id])