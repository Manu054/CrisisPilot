from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class MemoryRetainRequest(BaseModel):
    content: str
    tags: Optional[List[str]] = Field(default_factory=list)
    document_id: Optional[str] = None
    context_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class MemoryRecallRequest(BaseModel):
    query: str
    max_results: Optional[int] = 5
    tags: Optional[List[str]] = None


class MemoryCaseResponse(BaseModel):
    case_id: str
    case_number: int
    date: str
    title: str
    product: str
    similarity_score: float
    problem: str
    decision_taken: str
    outcome_metric: str
    status: str
    financial_impact: str
    margin_impact: str
    revenue_impact: str
    expected_outcome: str
    actual_outcome: str
    lesson_learned: str
    tags: List[str]
    region: Optional[str] = None
    reusability_score: Optional[str] = None


class MemoryInsightResponse(BaseModel):
    id: str
    text: str
    category: str
    supporting_case_count: int
    confidence: float
    last_observed: str
    related_products: List[str]
    related_strategies: List[str]
    empirical_rule: str
    impact_metric: str


class MemorySearchResponse(BaseModel):
    query: str
    total_memories: int
    memories: List[Dict[str, Any]]
    reflections: Optional[str] = None
