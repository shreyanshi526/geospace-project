# app/modules/projects/models/projectSchemas.py
from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel


class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sites_added_total: Optional[int] = None


class ProjectResponse(BaseModel):
    p_id: str
    name: str
    description: Optional[str]
    created_by: str
    updated_by: Optional[str]
    sites_added_total: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # ✅ Needed for SQLAlchemy -> Pydantic conversion


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict] = None
