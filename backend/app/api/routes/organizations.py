"""Organizations API routes.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.db.models import User, Organization
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/current")
async def get_current_organization(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve details of the authenticated user's organization."""
    org = await db.get(Organization, current_user.organization_id)
    if not org:
        raise NotFoundError("Organization not found")
    
    return {
        "id": str(org.id),
        "name": org.name,
        "industry": org.industry,
        "currency": org.currency,
        "timezone": org.timezone,
        "created_at": org.created_at.isoformat() if org.created_at else None,
        "updated_at": org.updated_at.isoformat() if org.updated_at else None,
    }
