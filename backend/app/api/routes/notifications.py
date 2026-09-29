"""Notifications API routes.
"""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.db.models import User
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
async def get_notifications(
    unread_only: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve system, crisis, and decision notifications for the organization."""
    service = NotificationService(db)
    notifications = await service.get_notifications(
        organization_id=current_user.organization_id,
        unread_only=unread_only,
        limit=limit,
    )
    return [
        {
            "id": str(n.id),
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.read,
            "crisis_id": str(n.related_crisis_id) if n.related_crisis_id else None,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifications
    ]

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a notification as read."""
    service = NotificationService(db)
    notification = await service.mark_read(
        notification_id=notification_id,
        organization_id=current_user.organization_id,
    )
    return {
        "id": str(notification.id) if notification else str(notification_id),
        "is_read": True,
        "title": notification.title if notification else "",
    }
