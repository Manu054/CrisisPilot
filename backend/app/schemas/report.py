import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ReportCreate(BaseModel):
    crisis_id: uuid.UUID
    title: Optional[str] = None


class ReportContentSchema(BaseModel):
    executive_summary: str
    current_situation: Dict[str, Any]
    historical_evidence: List[Dict[str, Any]]
    strategies_evaluated: List[Dict[str, Any]]
    recommended_decision: str
    expected_impact: Dict[str, Any]
    risk_analysis: List[str]
    action_plan: List[Dict[str, Any]]
    historical_cases_used: List[str]


class ReportResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    crisis_id: uuid.UUID
    title: str
    content: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
