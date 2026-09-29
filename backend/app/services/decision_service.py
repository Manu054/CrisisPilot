import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories import DecisionRepository, OutcomeRepository, CrisisRepository
from app.services.memory_service import memory_service
from app.core.exceptions import NotFoundError, OrganizationMismatchError
from app.schemas.decision import DecisionResponse, DecisionOutcomeRequest


class DecisionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decision_repo = DecisionRepository(session)
        self.outcome_repo = OutcomeRepository(session)
        self.crisis_repo = CrisisRepository(session)

    async def get_decisions(self, organization_id: uuid.UUID) -> List[DecisionResponse]:
        decisions = await self.decision_repo.get_by_org(organization_id)
        return [DecisionResponse.model_validate(d) for d in decisions]

    async def create_decision(self, organization_id: uuid.UUID, data: Any) -> DecisionResponse:
        decision = await self.decision_repo.create(
            crisis_id=data.crisis_id,
            organization_id=organization_id,
            strategy_type=data.strategy_type,
            parameters=data.parameters,
            expected_outcome=data.expected_outcome if hasattr(data, "expected_outcome") else {"clearance": 0.72},
            status="pending"
        )
        await self.session.commit()
        await self.session.refresh(decision)
        return DecisionResponse.model_validate(decision)

    async def get_decision_by_id(self, decision_id: uuid.UUID, organization_id: uuid.UUID) -> DecisionResponse:
        decision = await self.decision_repo.get_by_id(decision_id)
        if not decision:
            raise NotFoundError("Decision", str(decision_id))
        if decision.organization_id != organization_id:
            raise OrganizationMismatchError()
        return DecisionResponse.model_validate(decision)

    async def execute_decision(self, decision_id: uuid.UUID, organization_id: uuid.UUID) -> DecisionResponse:
        decision = await self.decision_repo.get_by_id(decision_id)
        if not decision:
            raise NotFoundError("Decision", str(decision_id))
        if decision.organization_id != organization_id:
            raise OrganizationMismatchError()

        now = datetime.now(timezone.utc)
        decision.status = "executed"
        decision.executed_at = now

        # Also update crisis status to decision_made
        crisis = await self.crisis_repo.get_by_id(decision.crisis_id)
        if crisis:
            crisis.status = "decision_made"

        # Retain in HindSight
        await memory_service.retain_decision(
            organization_id=organization_id,
            decision_id=decision.id,
            crisis_id=decision.crisis_id,
            strategy_type=decision.strategy_type,
            parameters=decision.parameters,
            expected_clearance=decision.expected_outcome.get("clearance", 0.72)
        )

        await self.session.commit()
        await self.session.refresh(decision)
        return DecisionResponse.model_validate(decision)

    async def record_outcome(
        self,
        decision_id: uuid.UUID,
        organization_id: uuid.UUID,
        data: DecisionOutcomeRequest
    ) -> Dict[str, Any]:
        """
        Records the real-world outcome, updates PostgreSQL, and retains
        the lesson in HindSight to complete the core organizational learning loop!
        """
        decision = await self.decision_repo.get_by_id(decision_id)
        if not decision:
            raise NotFoundError("Decision", str(decision_id))
        if decision.organization_id != organization_id:
            raise OrganizationMismatchError()

        now = datetime.now(timezone.utc)
        outcome_dict = data.model_dump()
        decision.actual_outcome = outcome_dict
        decision.status = "completed"
        decision.completed_at = now

        # Update crisis status to resolved
        crisis = await self.crisis_repo.get_by_id(decision.crisis_id)
        product_name = "Product X"
        if crisis:
            crisis.status = "resolved"
            product_name = crisis.input_data.get("product_name", "Product X")

        # Persist structured outcome record in PostgreSQL
        outcome_record = await self.outcome_repo.create(
            decision_id=decision.id,
            organization_id=organization_id,
            inventory_cleared=data.inventory_cleared,
            revenue=data.revenue,
            margin=data.margin,
            customer_response=data.customer_response,
            time_to_clear=data.time_to_clear,
            notes=data.notes
        )

        # RETAIN OUTCOME IN HINDSIGHT ORGANIZATIONAL MEMORY!
        # This closes the core loop: Past decisions -> Outcomes -> HindSight memory!
        await memory_service.retain_outcome(
            organization_id=organization_id,
            decision_id=decision.id,
            product_name=product_name,
            strategy_type=decision.strategy_type,
            inventory_cleared=data.inventory_cleared,
            revenue=data.revenue,
            margin=data.margin,
            notes=data.notes or "Outcome executed as planned."
        )

        await self.session.commit()

        return {
            "status": "outcome_recorded_and_retained",
            "decision_id": str(decision.id),
            "outcome_id": str(outcome_record.id),
            "hindsight_memory_updated": True
        }
