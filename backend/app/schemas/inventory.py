import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class RegionalStockItem(BaseModel):
    region: str
    units_available: int
    units_committed: int
    units_in_transit: int
    demand_index: int


class ProductInventoryItem(BaseModel):
    product_id: uuid.UUID
    sku: str
    name: str
    category: str
    price: float
    cost: float
    expiry_days: int
    total_units: int
    monthly_run_rate: int
    runway_days: int
    at_risk: bool
    exposure_amount: float
    risk_level: str
    regions: List[RegionalStockItem]


class InventorySummaryResponse(BaseModel):
    total_inventory_value: float
    total_at_risk_value: float
    revenue_impact_percentage: float
    active_decisions_count: int
    monitored_sku_count: int
    monthly_holding_cost: float


class InventoryRiskResponse(BaseModel):
    at_risk_products: List[ProductInventoryItem]
    aging_summary: List[Dict[str, Any]]
    total_at_risk_amount: float
