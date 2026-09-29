import uuid
from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.crisis_service import CrisisService
from app.schemas.recommendation import RecommendationRegenerateRequest
from app.schemas.crisis import CrisisAnalysisResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/{crisis_id}", response_model=CrisisAnalysisResponse)
async def get_recommendation(
    crisis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.analyze_crisis(
        crisis_id=crisis_id,
        organization_id=current_user.organization_id,
        objective="balanced"
    )


@router.post("/{crisis_id}/regenerate", response_model=CrisisAnalysisResponse)
async def regenerate_recommendation(
    crisis_id: uuid.UUID,
    req: RecommendationRegenerateRequest = RecommendationRegenerateRequest(),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CrisisService(session)
    return await service.analyze_crisis(
        crisis_id=crisis_id,
        organization_id=current_user.organization_id,
        objective=req.objective or "balanced"
    )
