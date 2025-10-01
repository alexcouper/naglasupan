from typing import Dict, List, Union
from pydantic import BaseModel


class PlatformAnalytics(BaseModel):
    total_projects: int
    pending_projects: int
    approved_projects: int
    total_users: int
    monthly_submissions: Dict[str, int]
    top_tags: List[Dict[str, Union[str, int]]]
    top_tech_stack: List[Dict[str, Union[str, int]]]