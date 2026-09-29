import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class RecommendationRegenerateRequest(BaseModel):
    objective: Optional[str] = "balanced"
    discount_limit: Optional[float] = None
    force_bundle: Optional[bool] = None
    target_region: Optional[str] = None


class RecommendationDetailResponse(BaseModel):
    id: uuid.UUID
    crisis_id: uuid.UUID
    strategy_id: Optional[str] = None
    recommendation_text: str
    reasoning: str
    confidence: float
    expected_impact: Dict[str, Any]
    risks: List[Any]
    historical_evidence: List[Any]
    assumptions: List[str]
    alternative_strategies: List[Dict[str, Any]]
