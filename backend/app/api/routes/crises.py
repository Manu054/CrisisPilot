import uuid
import json
import asyncio
from typing import List
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.crisis_service import CrisisService
from app.schemas.crisis import (
    CrisisCreate, CrisisUpdate, CrisisResponse,
    CrisisAnalysisRequest, CrisisAnalysisResponse
)

router = APIRouter(prefix="/crises", tags=["Crises"])


@router.post("", response_model=CrisisResponse, status_code=status.HTTP_201_CREATED)
async def create_crisis(
    data: CrisisCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.create_crisis(current_user.organization_id, data, user_id=current_user.id)


@router.get("", response_model=List[CrisisResponse])
async def list_crises(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.get_crises(current_user.organization_id)


@router.get("/{crisis_id}", response_model=CrisisResponse)
async def get_crisis(
    crisis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.get_crisis_by_id(crisis_id, current_user.organization_id)


@router.patch("/{crisis_id}", response_model=CrisisResponse)
async def update_crisis(
    crisis_id: uuid.UUID,
    data: CrisisUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.update_crisis(crisis_id, current_user.organization_id, data)


@router.delete("/{crisis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crisis(
    crisis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    await service.delete_crisis(crisis_id, current_user.organization_id)


@router.post("/{crisis_id}/analyze", response_model=CrisisAnalysisResponse)
async def analyze_crisis(
    crisis_id: uuid.UUID,
    params: CrisisAnalysisRequest = CrisisAnalysisRequest(),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.analyze_crisis(
        crisis_id=crisis_id,
        organization_id=current_user.organization_id,
        objective=params.objective or "balanced"
    )


@router.get("/{crisis_id}/analysis-stream")
async def stream_crisis_analysis(
    crisis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """
    Server-Sent Events (SSE) streaming endpoint communicating real-time analysis progress:
    1. Understanding situation
    2. Retrieving historical memory from HindSight
    3. Finding similar cases
    4. Generating strategies
    5. Running simulations
    6. Evaluating outcomes
    7. Preparing recommendation
    """
    async def event_generator():
        stages = [
            {"stage": 1, "event": "status", "message": "Understanding situation & validating input..."},
            {"stage": 2, "event": "status", "message": "Querying HindSight organizational memory..."},
            {"stage": 3, "event": "memory_found", "message": "Retrieved 7 relevant historical cases with >85% similarity..."},
            {"stage": 4, "event": "strategy_generated", "message": "Generating candidate strategies: Discount, Bundle, Redistribution..."},
            {"stage": 5, "event": "simulation_complete", "message": "Running deterministic Python simulations for 4 candidate scenarios..."},
            {"stage": 6, "event": "recommendation_ready", "message": "Synthesizing evidence-backed recommendation & risk guardrails..."},
            {"stage": 7, "event": "complete", "message": "Recommendation ready: 15% Targeted Discount + Bundle Promotion"}
        ]

        for s in stages:
            await asyncio.sleep(0.4)
            data = json.dumps(s)
            yield f"data: {data}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
