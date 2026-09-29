import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories import (
    CrisisRepository, ProductRepository, RecommendationRepository
)
from app.agents.orchestrator import orchestrator
from app.services.memory_service import memory_service
from app.core.exceptions import CrisisNotFoundError, OrganizationMismatchError
from app.schemas.crisis import CrisisCreate, CrisisUpdate, CrisisResponse, CrisisAnalysisResponse


class CrisisService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.crisis_repo = CrisisRepository(session)
        self.product_repo = ProductRepository(session)
        self.rec_repo = RecommendationRepository(session)

    async def get_crises(self, organization_id: uuid.UUID) -> List[CrisisResponse]:
        crises = await self.crisis_repo.get_by_org(organization_id)
        return [CrisisResponse.model_validate(c) for c in crises]

    async def get_active_crises(self, organization_id: uuid.UUID) -> List[CrisisResponse]:
        crises = await self.crisis_repo.get_active_crises(organization_id)
        return [CrisisResponse.model_validate(c) for c in crises]

    async def get_crisis_by_id(self, crisis_id: uuid.UUID, organization_id: uuid.UUID) -> CrisisResponse:
        crisis = await self.crisis_repo.get_by_id(crisis_id)
        if not crisis:
            raise CrisisNotFoundError(str(crisis_id))
        if crisis.organization_id != organization_id:
            raise OrganizationMismatchError()
        return CrisisResponse.model_validate(crisis)

    async def create_crisis(self, organization_id: uuid.UUID, data: CrisisCreate, user_id: Optional[uuid.UUID] = None) -> CrisisResponse:
        # Resolve product details if provided
        product_name = data.input_data.get("product_name", "Product X")
        price = data.input_data.get("price", 1000.0)
        cost = data.input_data.get("cost", 650.0)
        units = data.input_data.get("inventory_units", 48000)
        expiry_days = data.input_data.get("expiry_days", 90)

        crisis = await self.crisis_repo.create(
            organization_id=organization_id,
            title=data.title,
            crisis_type=data.crisis_type,
            description=data.description,
            product_id=data.product_id,
            severity=data.severity,
            status="analyzing",
            input_data={
                "product_name": product_name,
                "inventory_units": units,
                "monthly_sales": data.input_data.get("monthly_sales", 5000),
                "price": price,
                "cost": cost,
                "expiry_days": expiry_days,
                **data.input_data
            },
            created_by=user_id
        )

        # Retain new crisis in HindSight organizational memory
        await memory_service.retain_crisis(
            organization_id=organization_id,
            crisis_id=crisis.id,
            title=crisis.title,
            product_name=product_name,
            crisis_type=crisis.crisis_type,
            inventory_units=units,
            price=price,
            expiry_days=expiry_days
        )

        await self.session.commit()
        await self.session.refresh(crisis)
        return CrisisResponse.model_validate(crisis)

    async def analyze_crisis(
        self,
        crisis_id: uuid.UUID,
        organization_id: uuid.UUID,
        objective: str = "balanced"
    ) -> CrisisAnalysisResponse:
        crisis = await self.crisis_repo.get_by_id(crisis_id)
        if not crisis:
            raise CrisisNotFoundError(str(crisis_id))
        if crisis.organization_id != organization_id:
            raise OrganizationMismatchError()

        # Merge input data
        crisis_data = crisis.input_data or {}
        historical_pool = memory_service.get_seeded_historical_cases()

        # Execute multi-agent orchestration
        analysis_result = await orchestrator.run_crisis_analysis_pipeline(
            organization_id=organization_id,
            crisis_data=crisis_data,
            historical_cases_pool=historical_pool,
            objective=objective
        )

        # Update crisis status to recommendation_ready
        crisis.status = "recommendation_ready"

        # Persist or update recommendation in database
        rec_data = analysis_result["recommendation"]
        await self.rec_repo.create(
            crisis_id=crisis.id,
            organization_id=organization_id,
            strategy_id="strat-bundle-15",
            recommendation_text=rec_data["strategy"],
            reasoning=rec_data["why"],
            confidence=rec_data["confidence"],
            expected_impact=rec_data["expected_impact"],
            risks=rec_data["risks"],
            historical_evidence=analysis_result["historical_evidence"]
        )

        await self.session.commit()
        await self.session.refresh(crisis)

        return CrisisAnalysisResponse(
            crisis=CrisisResponse.model_validate(crisis),
            historical_evidence=analysis_result["historical_evidence"],
            strategies=analysis_result["strategies"],
            recommendation=analysis_result["recommendation"]
        )

    async def update_crisis(self, crisis_id: uuid.UUID, organization_id: uuid.UUID, data: CrisisUpdate) -> CrisisResponse:
        crisis = await self.crisis_repo.get_by_id(crisis_id)
        if not crisis:
            raise CrisisNotFoundError(str(crisis_id))
        if crisis.organization_id != organization_id:
            raise OrganizationMismatchError()

        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        updated = await self.crisis_repo.update(crisis_id, **update_dict)
        await self.session.commit()
        return CrisisResponse.model_validate(updated)

    async def delete_crisis(self, crisis_id: uuid.UUID, organization_id: uuid.UUID) -> bool:
        crisis = await self.crisis_repo.get_by_id(crisis_id)
        if not crisis:
            raise CrisisNotFoundError(str(crisis_id))
        if crisis.organization_id != organization_id:
            raise OrganizationMismatchError()

        success = await self.crisis_repo.delete(crisis_id)
        await self.session.commit()
        return success
