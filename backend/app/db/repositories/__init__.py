import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import (
    Organization, User, Product, InventorySnapshot, SalesRecord,
    Crisis, Decision, Strategy, Simulation, Recommendation, Outcome, Report, Notification
)
from app.db.repositories.base_repo import BaseRepository


class OrganizationRepository(BaseRepository[Organization]):
    def __init__(self, session: AsyncSession):
        super().__init__(Organization, session)

    async def get_by_name(self, name: str) -> Optional[Organization]:
        result = await self.session.execute(select(Organization).where(Organization.name == name))
        return result.scalars().first()


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalars().first()


class ProductRepository(BaseRepository[Product]):
    def __init__(self, session: AsyncSession):
        super().__init__(Product, session)

    async def get_by_sku(self, organization_id: uuid.UUID, sku: str) -> Optional[Product]:
        stmt = select(Product).where(and_(Product.organization_id == organization_id, Product.sku == sku))
        result = await self.session.execute(stmt)
        return result.scalars().first()


class CrisisRepository(BaseRepository[Crisis]):
    def __init__(self, session: AsyncSession):
        super().__init__(Crisis, session)

    async def get_active_crises(self, organization_id: uuid.UUID) -> List[Crisis]:
        stmt = (
            select(Crisis)
            .where(and_(Crisis.organization_id == organization_id, Crisis.status != "resolved", Crisis.status != "archived"))
            .order_by(desc(Crisis.created_at))
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


class DecisionRepository(BaseRepository[Decision]):
    def __init__(self, session: AsyncSession):
        super().__init__(Decision, session)

    async def get_recent_decisions(self, organization_id: uuid.UUID, limit: int = 10) -> List[Decision]:
        stmt = (
            select(Decision)
            .where(Decision.organization_id == organization_id)
            .order_by(desc(Decision.created_at))
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


class SimulationRepository(BaseRepository[Simulation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Simulation, session)

    async def get_by_crisis(self, crisis_id: uuid.UUID) -> List[Simulation]:
        stmt = select(Simulation).where(Simulation.crisis_id == crisis_id).order_by(desc(Simulation.created_at))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_org(self, organization_id: uuid.UUID, limit: int = 50) -> List[Simulation]:
        stmt = (
            select(Simulation)
            .where(Simulation.organization_id == organization_id)
            .order_by(desc(Simulation.created_at))
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


class RecommendationRepository(BaseRepository[Recommendation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Recommendation, session)

    async def get_latest_by_crisis(self, crisis_id: uuid.UUID) -> Optional[Recommendation]:
        stmt = (
            select(Recommendation)
            .where(Recommendation.crisis_id == crisis_id)
            .order_by(desc(Recommendation.created_at))
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()


class OutcomeRepository(BaseRepository[Outcome]):
    def __init__(self, session: AsyncSession):
        super().__init__(Outcome, session)


class ReportRepository(BaseRepository[Report]):
    def __init__(self, session: AsyncSession):
        super().__init__(Report, session)

    async def get_by_crisis(self, crisis_id: uuid.UUID) -> Optional[Report]:
        stmt = select(Report).where(Report.crisis_id == crisis_id).order_by(desc(Report.created_at))
        result = await self.session.execute(stmt)
        return result.scalars().first()


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession):
        super().__init__(Notification, session)

    async def get_user_notifications(self, organization_id: uuid.UUID, limit: int = 20) -> List[Notification]:
        stmt = (
            select(Notification)
            .where(Notification.organization_id == organization_id)
            .order_by(desc(Notification.created_at))
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def mark_as_read(self, notification_id: uuid.UUID) -> Optional[Notification]:
        stmt = (
            Notification.__table__.update()
            .where(Notification.id == notification_id)
            .values(read=True)
            .returning(Notification)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()
