import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.calculations import simulate_strategy_metrics
from app.schemas.simulation import (
    SimulationParamsInput,
    SimulationResultOutput,
    ScenarioComparisonItem,
    SimulationScenarioCompareResponse
)
from app.db.repositories import SimulationRepository


class SimulationService:
    def __init__(self, session: Optional[AsyncSession] = None):
        self.session = session
        self.repo = SimulationRepository(session) if session else None

    def run_simulation(self, params: SimulationParamsInput) -> SimulationResultOutput:
        """
        Executes deterministic mathematical simulation.
        Calculations are strictly performed in Python.
        """
        result = simulate_strategy_metrics(
            inventory_units=params.inventory_units,
            monthly_sales=params.monthly_sales,
            price=params.price,
            cost=params.cost,
            expiry_days=params.expiry_days,
            discount_percentage=params.discount_percentage,
            promotion_duration_days=params.promotion_duration,
            promotion_lift=params.promotion_lift or 1.0,
            campaign_budget=params.campaign_budget or 0.0
        )
        return SimulationResultOutput(**result)

    def compare_scenarios(
        self,
        product: str,
        inventory_units: int,
        monthly_sales: int,
        price: float,
        cost: float,
        expiry_days: int,
        custom_scenarios: Optional[List[Dict[str, Any]]] = None
    ) -> SimulationScenarioCompareResponse:
        """
        Compares predefined scenarios A, B, C, D or user-defined candidates.
        """
        scenarios_to_run = custom_scenarios or [
            {
                "id": "scen-a",
                "name": "Scenario A: 10% Conservative Markdown",
                "discount_percentage": 0.10,
                "promotion_duration": 90,
                "promotion_lift": 1.10,
                "campaign_budget": 400000.0,
                "regional_allocation": "All Regions"
            },
            {
                "id": "scen-b",
                "name": "Scenario B: 15% Discount + Bundle (AI Recommended)",
                "discount_percentage": 0.15,
                "promotion_duration": 60,
                "promotion_lift": 1.45,
                "campaign_budget": 850000.0,
                "regional_allocation": "All Regions"
            },
            {
                "id": "scen-c",
                "name": "Scenario C: 20% Direct Price Cut",
                "discount_percentage": 0.20,
                "promotion_duration": 35,
                "promotion_lift": 1.70,
                "campaign_budget": 1200000.0,
                "regional_allocation": "All Regions"
            },
            {
                "id": "scen-d",
                "name": "Scenario D: Regional Redistribution",
                "discount_percentage": 0.05,
                "promotion_duration": 45,
                "promotion_lift": 1.30,
                "campaign_budget": 580000.0,
                "regional_allocation": "South Zone (Bengaluru/HYD)"
            }
        ]

        items: List[ScenarioComparisonItem] = []
        for scen in scenarios_to_run:
            sim_input = SimulationParamsInput(
                product=product,
                inventory_units=inventory_units,
                monthly_sales=monthly_sales,
                price=price,
                cost=cost,
                expiry_days=expiry_days,
                discount_percentage=scen.get("discount_percentage", 0.15),
                promotion_duration=scen.get("promotion_duration", 60),
                promotion_lift=scen.get("promotion_lift", 1.0),
                campaign_budget=scen.get("campaign_budget", 0.0),
                regional_allocation=scen.get("regional_allocation", "All Regions")
            )
            sim_res = self.run_simulation(sim_input)
            items.append(ScenarioComparisonItem(
                scenario_id=scen.get("id", str(uuid.uuid4())),
                name=scen.get("name", "Scenario"),
                parameters=scen,
                result=sim_res
            ))

        return SimulationScenarioCompareResponse(
            product=product,
            scenarios=items
        )

    async def save_simulation(
        self,
        organization_id: uuid.UUID,
        crisis_id: uuid.UUID,
        name: str,
        params: SimulationParamsInput,
        result: SimulationResultOutput
    ):
        if not self.repo:
            return None
        return await self.repo.create(
            organization_id=organization_id,
            crisis_id=crisis_id,
            name=name,
            parameters=params.model_dump(),
            projected_inventory_clearance=result.inventory_clearance_percentage,
            projected_revenue=result.estimated_revenue,
            projected_margin=result.estimated_margin,
            projected_time_to_clear=result.estimated_clearance_days,
            risk_score=result.risk_score
        )
