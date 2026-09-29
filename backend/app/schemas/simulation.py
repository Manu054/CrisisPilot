import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


class SimulationTimelinePoint(BaseModel):
    day: int
    clearance_pct: float
    revenue: float
    remaining_stock: int


class SimulationParamsInput(BaseModel):
    product: Optional[str] = "Product X"
    inventory_units: int = Field(default=48000, ge=1)
    monthly_sales: int = Field(default=5000, ge=0)
    price: float = Field(default=1000.0, ge=0.0)
    cost: float = Field(default=650.0, ge=0.0)
    expiry_days: int = Field(default=90, ge=1)
    discount_percentage: float = Field(default=0.15)
    promotion_duration: int = Field(default=60, ge=1)
    promotion_lift: Optional[float] = Field(default=1.35, ge=0.5)
    regional_allocation: Optional[str] = "All Regions"
    campaign_budget: Optional[float] = Field(default=850000.0, ge=0.0)

    @field_validator("discount_percentage", mode="before")
    @classmethod
    def normalize_discount(cls, v: Any) -> float:
        if v is None:
            return 0.15
        val = float(v)
        if val > 1.0:
            val = val / 100.0
        return min(max(val, 0.0), 1.0)

    @field_validator("campaign_budget", mode="before")
    @classmethod
    def normalize_campaign_budget(cls, v: Any) -> float:
        if v is None:
            return 850000.0
        val = float(v)
        # If passed in Lakhs (e.g. 7.5 or 8.5 instead of 750,000), convert to currency amount
        if 0 < val <= 500:
            val = val * 100000.0
        return max(val, 0.0)


class SimulationResultOutput(BaseModel):
    inventory_clearance_percentage: float
    cleared_units: int
    remaining_inventory: int
    estimated_revenue: float
    estimated_margin: float
    estimated_margin_change: float
    estimated_clearance_days: int
    risk_score: str
    timeline_projection: List[SimulationTimelinePoint]


class ScenarioComparisonItem(BaseModel):
    scenario_id: str
    name: str
    parameters: Dict[str, Any]
    result: SimulationResultOutput


class SimulationScenarioCompareRequest(BaseModel):
    product: Optional[str] = "Product X"
    inventory_units: int = 48000
    monthly_sales: int = 5000
    price: float = 1000.0
    cost: float = 650.0
    expiry_days: int = 90
    scenarios: Optional[List[Dict[str, Any]]] = None


class SimulationScenarioCompareResponse(BaseModel):
    product: str
    scenarios: List[ScenarioComparisonItem]
