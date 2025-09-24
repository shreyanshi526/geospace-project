from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SiteBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    area: Optional[float] = None
    location: Optional[str] = None
    geolocation: Optional[List[Dict[str, float]]] = None
    analytics: Optional[Dict[str, Any]] = None


class SiteCreate(SiteBase):
    project_id: str


class SiteUpdate(SiteBase):
    pass


class SiteResponse(SiteBase):
    id: str
    project_id: str
    created_by: str
    updated_by: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SiteAnalyticsRecord(BaseModel):
    id: str
    site_id: str
    project_id: str
    analytics: Dict[str, Any]
    created_at: datetime

    class Config:
        orm_mode = True


class ChartMetricPoint(BaseModel):
    x: str
    y: float


class ChartMetric(BaseModel):
    unit: str
    values: List[ChartMetricPoint]


class SiteAnalyticsHistoryResponse(BaseModel):
    history: List[SiteAnalyticsRecord]
    chart: Dict[str, ChartMetric]

    class Config:
        orm_mode = True


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict] = None
