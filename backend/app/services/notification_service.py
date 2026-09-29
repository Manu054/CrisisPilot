import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories import NotificationRepository
from app.db.models import Notification


class NotificationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = NotificationRepository(session)

    async def get_notifications(
        self,
        organization_id: uuid.UUID,
        unread_only: bool = False,
        limit: int = 50,
    ) -> List[Notification]:
        return await self.repo.get_user_notifications(organization_id)

    async def mark_read(self, notification_id: uuid.UUID, organization_id: Optional[uuid.UUID] = None) -> Optional[Notification]:
        notif = await self.repo.mark_as_read(notification_id)
        await self.session.commit()
        return notif
