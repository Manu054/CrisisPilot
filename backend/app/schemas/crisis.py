import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


class CrisisCreate(BaseModel):
    title: str = Field(..., example="Product X Excess Inventory Crisis")
    crisis_type: str = Field(..., example="excess_inventory")
    description: str = Field(..., example="48,000 units of Product X remain unsold with 90 days until expiry.")
    product_id: Optional[uuid.UUID] = None
    severity: str = Field(default="high", example="critical")
    input_data: Dict[str, Any] = Field(default_factory=dict)


class CrisisUpdate(BaseModel):
    title: Optional[str] = None
    crisis_type: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    input_data: Optional[Dict[str, Any]] = None


class CrisisResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    title: str
    crisis_type: str
    description: str
    product_id: Optional[uuid.UUID] = None
    severity: str
    status: str
    input_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CrisisAnalysisRequest(BaseModel):
    objective: Optional[str] = Field(
        default="balanced",
        description="Business objective: 'maximize_clearance', 'protect_margin', 'maximize_revenue', 'minimize_time', 'minimize_risk', 'balanced'"
    )
    risk_floor_margin: Optional[float] = Field(default=0.15, description="Minimum acceptable margin fraction (e.g. 0.15 for 15%)")
    include_hindsight_reflection: Optional[bool] = True


class HistoricalEvidenceItem(BaseModel):
    case_id: str
    case_number: Optional[int] = None
    similarity: float
    title: str
    date: str
    problem: str
    decision_taken: str
    outcome_summary: str
    margin_impact: str
    revenue_impact: str
    relevance_explanation: str


class StrategyEvaluationItem(BaseModel):
    id: str
    name: str
    strategy_type: str
    badge: Optional[str] = None
    is_recommended: bool = False
    projected_clearance: float  # 0.0 - 1.0 (e.g. 0.72)
    cleared_units: int
    remaining_units: int
    projected_revenue: float    # Raw monetary amount (e.g. 36000000)
    projected_margin_change: float # (e.g. -0.18)
    effective_margin_percent: float # (e.g. 24.6)
    days_to_clear: int
    risk_score: str
    description: str
    actions: List[str]


class RecommendationSummary(BaseModel):
    strategy: str
    why: str
    similar_cases_count: int
    confidence: float
    expected_impact: Dict[str, Any]
    risks: List[str] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    alternative_strategies: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)

    @field_validator("risks", "assumptions", "alternative_strategies", "next_steps", mode="before")
    @classmethod
    def ensure_list_of_strings(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return [str(item) for item in v]
        if isinstance(v, str):
            import re
            # Split by newlines, or numbered items like '1. ', or bullet marks ' - '
            raw_parts = re.split(r'\n+|\s*-\s+|\s*\d+\.\s+', v)
            cleaned = [p.strip().lstrip("-*•. ").strip() for p in raw_parts if p.strip()]
            return cleaned if cleaned else [v.strip()]
        return []


class CrisisAnalysisResponse(BaseModel):
    crisis: CrisisResponse
    historical_evidence: List[HistoricalEvidenceItem]
    strategies: List[StrategyEvaluationItem]
    recommendation: RecommendationSummary
