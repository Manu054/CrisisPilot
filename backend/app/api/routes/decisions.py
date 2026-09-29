import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.decision_service import DecisionService
from app.schemas.decision import DecisionResponse, DecisionOutcomeRequest, DecisionCreate

router = APIRouter(prefix="/decisions", tags=["Decisions"])


@router.post("", response_model=DecisionResponse)
async def create_decision(
    data: DecisionCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = DecisionService(session)
    return await service.create_decision(current_user.organization_id, data)


@router.get("", response_model=List[DecisionResponse])
async def list_decisions(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = DecisionService(session)
    return await service.get_decisions(current_user.organization_id)


@router.get("/{decision_id}", response_model=DecisionResponse)
async def get_decision(
    decision_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = DecisionService(session)
    return await service.get_decision_by_id(decision_id, current_user.organization_id)


@router.post("/{decision_id}/execute", response_model=DecisionResponse)
async def execute_decision(
    decision_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = DecisionService(session)
    return await service.execute_decision(decision_id, current_user.organization_id)


@router.post("/{decision_id}/outcome")
async def record_decision_outcome(
    decision_id: uuid.UUID,
    data: DecisionOutcomeRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = DecisionService(session)
    return await service.record_outcome(decision_id, current_user.organization_id, data)
