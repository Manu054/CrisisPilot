import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.simulation_service import SimulationService
from app.schemas.simulation import (
    SimulationParamsInput,
    SimulationResultOutput,
    SimulationScenarioCompareRequest,
    SimulationScenarioCompareResponse
)

router = APIRouter(prefix="/simulations", tags=["Simulations"])


@router.post("", response_model=SimulationResultOutput)
async def run_simulation(
    params: SimulationParamsInput,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = SimulationService(session)
    return service.run_simulation(params)


@router.post("/compare", response_model=SimulationScenarioCompareResponse)
async def compare_scenarios(
    req: SimulationScenarioCompareRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = SimulationService(session)
    return service.compare_scenarios(
        product=req.product or "Product X",
        inventory_units=req.inventory_units,
        monthly_sales=req.monthly_sales,
        price=req.price,
        cost=req.cost,
        expiry_days=req.expiry_days,
        custom_scenarios=req.scenarios
    )
@router.get("")
async def get_simulations(
    crisis_id: Optional[uuid.UUID] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    from app.db.repositories import SimulationRepository
    repo = SimulationRepository(session)
    if crisis_id:
        sims = await repo.get_by_crisis(crisis_id)
    else:
        sims = await repo.get_by_org(current_user.organization_id)
    return [
        {
            "id": str(s.id),
            "crisis_id": str(s.crisis_id) if s.crisis_id else None,
            "name": s.name,
            "parameters": s.parameters,
            "projected_inventory_clearance": s.projected_inventory_clearance,
            "projected_revenue": s.projected_revenue,
            "projected_margin": s.projected_margin,
            "projected_time_to_clear": s.projected_time_to_clear,
            "risk_score": s.risk_score,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in sims
    ]


@router.get("/{simulation_id}")
async def get_simulation(
    simulation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    from fastapi import HTTPException
    from app.db.repositories import SimulationRepository
    repo = SimulationRepository(session)
    sim = await repo.get_by_id(simulation_id)
    if not sim or sim.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {
        "id": str(sim.id),
        "crisis_id": str(sim.crisis_id) if sim.crisis_id else None,
        "name": sim.name,
        "parameters": sim.parameters,
        "projected_inventory_clearance": sim.projected_inventory_clearance,
        "projected_revenue": sim.projected_revenue,
        "projected_margin": sim.projected_margin,
        "projected_time_to_clear": sim.projected_time_to_clear,
        "risk_score": sim.risk_score,
        "created_at": sim.created_at.isoformat() if sim.created_at else None
    }
