from datetime import datetime
from typing import Any, Dict, List, Optional
import enum
from pydantic import BaseModel, Field, validator

class SiteStatus(str, enum.Enum):  # ← KEY FIX: inherit from str and enum.Enum
    ACTIVE = "active"
    INACTIVE = "inactive"

class SiteBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    site_type: Optional[str] = None
    area: Optional[float] = None
    status: SiteStatus = SiteStatus.ACTIVE
    location: Optional[str] = None
    geolocation: Optional[List[Dict[str, float]]] = None
    analytics: Optional[Dict[str, Any]] = None
    
    # Validator to handle string input for status
    @validator('status', pre=True)
    def validate_status(cls, v):
        if isinstance(v, str):
            return SiteStatus(v)
        return v

class SiteCreate(SiteBase):
    project_id: str

class SiteUpdate(SiteBase):
    # Make all fields optional for updates
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    status: Optional[SiteStatus] = None

class SiteResponse(SiteBase):
    id: str
    project_id: str
    created_by: str
    updated_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        use_enum_values = True  # This ensures enums are serialized as their values
        
        # JSON encoders for proper serialization
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            SiteStatus: lambda v: v.value
        }

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