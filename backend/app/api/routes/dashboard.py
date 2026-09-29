from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.inventory_service import InventoryService
from app.services.crisis_service import CrisisService
from app.services.decision_service import DecisionService
from app.schemas.crisis import CrisisResponse
from app.schemas.decision import DecisionResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    inv_service = InventoryService(session)
    summary = await inv_service.get_inventory_summary(current_user.organization_id)

    return {
        "organization_id": current_user.organization_id,
        "total_inventory": summary.total_inventory_value,
        "at_risk_inventory": summary.total_at_risk_value,
        "revenue_impact_percent": summary.revenue_impact_percentage,
        "active_decisions": summary.active_decisions_count,
        "monitored_skus": summary.monitored_sku_count,
        "monthly_holding_cost": summary.monthly_holding_cost
    }


@router.get("/active-crises", response_model=List[CrisisResponse])
async def get_active_crises(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    crisis_service = CrisisService(session)
    return await crisis_service.get_active_crises(current_user.organization_id)


@router.get("/recent-decisions", response_model=List[DecisionResponse])
async def get_recent_decisions(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    decision_service = DecisionService(session)
    return await decision_service.get_decisions(current_user.organization_id)
