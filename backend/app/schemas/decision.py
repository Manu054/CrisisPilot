import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class DecisionCreate(BaseModel):
    crisis_id: uuid.UUID
    strategy_type: str
    parameters: Dict[str, Any]
    expected_outcome: Dict[str, Any]


class DecisionExecuteRequest(BaseModel):
    notes: Optional[str] = None


class DecisionOutcomeRequest(BaseModel):
    inventory_cleared: float = Field(..., description="Proportion or percentage of inventory cleared, e.g. 0.72 or 72%")
    revenue: float = Field(..., description="Actual revenue realized (raw numeric amount, e.g. 36000000)")
    margin: float = Field(..., description="Effective realized margin or margin percentage change, e.g. -0.18 or 0.246")
    customer_response: Optional[str] = Field(default="High", description="High, Medium, Low, or qualitative feedback")
    time_to_clear: int = Field(..., description="Days taken to achieve clearance")
    notes: Optional[str] = Field(default="", description="Key retrospective post-mortem notes and lessons learned")


class DecisionResponse(BaseModel):
    id: uuid.UUID
    crisis_id: uuid.UUID
    organization_id: uuid.UUID
    strategy_type: str
    parameters: Dict[str, Any]
    expected_outcome: Dict[str, Any]
    actual_outcome: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime
    executed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
