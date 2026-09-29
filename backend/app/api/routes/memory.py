import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, status
from app.api.deps import get_current_user
from app.db.models import User
from app.services.memory_service import memory_service
from app.schemas.memory import (
    MemoryRetainRequest,
    MemoryCaseResponse,
    MemoryInsightResponse,
    MemorySearchResponse
)

router = APIRouter(prefix="/memory", tags=["HindSight Memory"])


@router.get("/search", response_model=MemorySearchResponse)
async def search_memory(
    q: Optional[str] = Query(default=None, description="Semantic search query"),
    query: Optional[str] = Query(default=None, description="Semantic search query"),
    limit: Optional[int] = Query(default=None, description="Max results"),
    max_results: Optional[int] = Query(default=None, description="Max results"),
    current_user: User = Depends(get_current_user)
):
    search_q = query or q or ""
    res_limit = max_results or limit or 5
    result = await memory_service.recall_memories(
        organization_id=current_user.organization_id,
        query=search_q,
        max_results=res_limit
    )
    return MemorySearchResponse(**result)


@router.get("/insights", response_model=List[MemoryInsightResponse])
async def get_insights(current_user: User = Depends(get_current_user)):
    insights = memory_service.get_memory_insights()
    return [MemoryInsightResponse(**i) for i in insights]


@router.get("/cases", response_model=List[MemoryCaseResponse])
async def get_historical_cases(current_user: User = Depends(get_current_user)):
    cases = memory_service.get_seeded_historical_cases()
    return [MemoryCaseResponse(
        case_id=c["id"],
        case_number=c["case_number"],
        date=c["date"],
        title=c["title"],
        product=c["product"],
        similarity_score=c["similarity"],
        problem=c["problem"],
        decision_taken=c["decision_taken"],
        outcome_metric=c["outcome_metric"],
        status=c["status"],
        financial_impact=c["financial_impact"],
        margin_impact=c["margin_impact"],
        revenue_impact=c["revenue_impact"],
        expected_outcome=c["expected_outcome"],
        actual_outcome=c["actual_outcome"],
        lesson_learned=c["lesson_learned"],
        tags=c["tags"],
        region=c.get("region")
    ) for c in cases]


@router.post("/retain", status_code=status.HTTP_201_CREATED)
async def retain_memory(
    data: MemoryRetainRequest,
    current_user: User = Depends(get_current_user)
):
    return await memory_service.retain_insight(
        organization_id=current_user.organization_id,
        insight_statement=data.content,
        category="General Strategy",
        supporting_case_count=1
    )
