import math
from typing import Dict, Any, List


def calculate_discounted_price(price: float, discount_percentage: float) -> float:
    return round(price * (1.0 - discount_percentage), 2)


def calculate_gross_margin(discounted_price: float, cost: float, units: int, campaign_budget: float = 0.0) -> float:
    gross = (discounted_price - cost) * units
    net = gross - campaign_budget
    return round(net, 2)


def calculate_inventory_runway_days(inventory_units: int, monthly_sales: int) -> float:
    if monthly_sales <= 0:
        return 999.0
    daily_sales = monthly_sales / 30.0
    return round(inventory_units / daily_sales, 1)


def simulate_strategy_metrics(
    inventory_units: int,
    monthly_sales: int,
    price: float,
    cost: float,
    expiry_days: int,
    discount_percentage: float,
    promotion_duration_days: int,
    promotion_lift: float = 1.0,
    campaign_budget: float = 0.0,
    elasticity_factor: float = 1.65
) -> Dict[str, Any]:
    """
    Deterministic mathematical simulation of inventory clearance, revenue, and margins.
    Calculates expected results without LLM fabrication.
    """
    discounted_price = calculate_discounted_price(price, discount_percentage)
    
    # Baseline daily run rate
    daily_base = monthly_sales / 30.0 if monthly_sales > 0 else 1.0
    
    # Price elasticity lift: discount stimulates demand non-linearly
    # Calibrated with Case #104 and Case #51
    discount_lift = 1.0 + (discount_percentage * elasticity_factor * 2.2)
    
    # Combined effective velocity (units per day)
    combined_velocity = daily_base * discount_lift * promotion_lift
    
    # Campaign duration factor
    duration_factor = min(1.25, math.sqrt(promotion_duration_days / 45.0))
    budget_bonus_pct = min(15.0, (campaign_budget / 100000.0) * 1.1)
    
    # Calculate expected units cleared within promotion duration
    projected_units_cleared = int(combined_velocity * promotion_duration_days * (duration_factor * 0.85))
    
    # Max clearance capped at 95% (natural channel friction) and total units
    cleared_units = min(int(inventory_units * 0.95), min(inventory_units, projected_units_cleared))
    
    # Clearance percentage
    clearance_pct = round(cleared_units / inventory_units, 4) if inventory_units > 0 else 0.0
    remaining_units = max(0, inventory_units - cleared_units)
    
    # Financial metrics
    gross_revenue = round(cleared_units * discounted_price, 2)
    net_margin_inr = calculate_gross_margin(discounted_price, cost, cleared_units, campaign_budget)
    
    effective_margin_pct = round((net_margin_inr / gross_revenue) * 100.0, 2) if gross_revenue > 0 else 0.0
    
    # Baseline margin before discount
    baseline_margin_pct = round(((price - cost) / price) * 100.0, 2) if price > 0 else 0.0
    margin_change_fraction = round((effective_margin_pct - baseline_margin_pct) / 100.0, 4)
    
    # Days to clear
    days_to_clear = min(promotion_duration_days, max(14, int(promotion_duration_days * (1.0 - (clearance_pct / 1.35)))))
    
    # Deterministic Risk scoring
    if discount_percentage >= 0.25 or effective_margin_pct < 15.0:
        risk_score = "High"
    elif discount_percentage >= 0.18 or remaining_units > (inventory_units * 0.35):
        risk_score = "Moderate"
    elif clearance_pct < 0.50 and expiry_days <= 90:
        risk_score = "Elevated"
    else:
        risk_score = "Low"
        
    # Projected timeline trajectory at 0, 15, 30, 45, 60, 75, 90 days for Recharts
    timeline_projection: List[Dict[str, Any]] = []
    milestone_days = [0, 15, 30, 45, 60, 75, 90]
    
    for day in milestone_days:
        if day == 0:
            cur_clear_pct = 0.0
            cur_cleared = 0
            cur_rev = 0.0
        else:
            progress = min(1.0, day / float(days_to_clear)) if days_to_clear > 0 else 1.0
            ease = 1.0 - math.pow(1.0 - progress, 2.0)
            cur_clear_pct = round(clearance_pct * ease, 4)
            cur_cleared = int(inventory_units * cur_clear_pct)
            cur_rev = round(cur_cleared * discounted_price, 2)
            
        cur_remaining = max(0, inventory_units - cur_cleared)
        timeline_projection.append({
            "day": day,
            "clearance_pct": round(cur_clear_pct * 100.0, 1),
            "revenue": cur_rev,
            "remaining_stock": cur_remaining
        })
        
    return {
        "inventory_clearance_percentage": clearance_pct,
        "cleared_units": cleared_units,
        "remaining_inventory": remaining_units,
        "estimated_revenue": gross_revenue,
        "estimated_margin": effective_margin_pct,
        "estimated_margin_change": margin_change_fraction,
        "estimated_clearance_days": days_to_clear,
        "risk_score": risk_score,
        "timeline_projection": timeline_projection
    }


class SimulationResult(dict):
    """Dictionary supporting dot-attribute access for simulation results."""
    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError:
            raise AttributeError(f"'SimulationResult' object has no attribute '{name}'")

    def __setattr__(self, name, value):
        self[name] = value


def simulate_strategy(
    inventory_units: int,
    monthly_sales: int,
    price: float,
    cost: float,
    expiry_days: int,
    discount_percentage: float,
    promotion_duration_days: int,
    promotion_lift: float = 1.0,
    regional_allocation: int = 0,
    campaign_budget: float = 0.0,
    elasticity_factor: float = 1.65
) -> SimulationResult:
    """Wrapper returning SimulationResult with attribute and dictionary access."""
    res = simulate_strategy_metrics(
        inventory_units=inventory_units,
        monthly_sales=monthly_sales,
        price=price,
        cost=cost,
        expiry_days=expiry_days,
        discount_percentage=discount_percentage,
        promotion_duration_days=promotion_duration_days,
        promotion_lift=promotion_lift,
        campaign_budget=campaign_budget,
        elasticity_factor=elasticity_factor
    )
    return SimulationResult(res)
