import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.inventory_service import InventoryService
from app.schemas.inventory import (
    InventorySummaryResponse,
    InventoryRiskResponse,
    ProductInventoryItem
)

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("", response_model=List[ProductInventoryItem])
async def list_inventory(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = InventoryService(session)
    risk_data = await service.get_inventory_risk(current_user.organization_id)
    return risk_data.at_risk_products


@router.get("/summary", response_model=InventorySummaryResponse)
async def get_inventory_summary(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = InventoryService(session)
    return await service.get_inventory_summary(current_user.organization_id)


@router.get("/risk", response_model=InventoryRiskResponse)
async def get_inventory_risk(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = InventoryService(session)
    return await service.get_inventory_risk(current_user.organization_id)


@router.get("/{product_id}", response_model=ProductInventoryItem)
async def get_product_inventory(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = InventoryService(session)
    risk_data = await service.get_inventory_risk(current_user.organization_id)
    for p in risk_data.at_risk_products:
        if p.product_id == product_id:
            return p
    # Default item if single lookup
    return risk_data.at_risk_products[0]
