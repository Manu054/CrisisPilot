"""Unit tests for deterministic calculations and simulation engine.
Verifies arithmetic accuracy without LLM intervention.
"""
import pytest
from app.utils.calculations import (
    calculate_discounted_price,
    calculate_gross_margin,
    calculate_inventory_runway_days,
    simulate_strategy,
    simulate_strategy_metrics,
)


def test_discounted_price_calculation():
    """Verify section 40 unit test specification:
    price = 1000, cost = 650, discount = 0.15 -> discounted price: 850, unit margin: 200.
    """
    price = 1000.0
    cost = 650.0
    discount = 0.15

    discounted_price = calculate_discounted_price(price, discount)
    assert discounted_price == 850.0

    unit_margin = calculate_gross_margin(discounted_price, cost, units=1)
    assert unit_margin == 200.0


def test_inventory_runway_calculation():
    """Verify inventory runway in days."""
    inventory_units = 48000
    monthly_sales = 5000  # daily sales = 5000 / 30 = 166.67 units/day
    runway_days = calculate_inventory_runway_days(inventory_units, monthly_sales)
    # 48000 / (5000/30) = 288 days
    assert runway_days == 288.0

    # Zero sales edge case
    assert calculate_inventory_runway_days(1000, 0) == 999.0


def test_deterministic_simulation_metrics():
    """Test full simulation engine for 48,000 units Product X."""
    res = simulate_strategy(
        inventory_units=48000,
        monthly_sales=5000,
        price=1000.0,
        cost=650.0,
        expiry_days=90,
        discount_percentage=0.15,
        promotion_duration_days=60,
        promotion_lift=1.45,
        campaign_budget=200000.0,
    )

    # Deterministic checks
    assert res.cleared_units > 0
    assert res.remaining_inventory == 48000 - res.cleared_units
    assert 0.0 < res.inventory_clearance_percentage <= 1.0
    assert res.estimated_revenue > 0
    assert res.estimated_margin > 0
    assert res.estimated_clearance_days <= 60
    assert len(res.timeline_projection) == 7  # 0, 15, 30, 45, 60, 75, 90


def test_discount_elasticity_comparison():
    """Verify that deeper discounts clear inventory faster but degrade margins."""
    sim_10 = simulate_strategy(
        inventory_units=48000,
        monthly_sales=5000,
        price=1000.0,
        cost=650.0,
        expiry_days=90,
        discount_percentage=0.10,
        promotion_duration_days=60,
        promotion_lift=1.2,
    )

    sim_30 = simulate_strategy(
        inventory_units=48000,
        monthly_sales=5000,
        price=1000.0,
        cost=650.0,
        expiry_days=90,
        discount_percentage=0.30,
        promotion_duration_days=60,
        promotion_lift=1.7,
    )

    # 30% discount must clear more units than 10% discount
    assert sim_30.cleared_units > sim_10.cleared_units
    # 30% discount must have lower percentage margin than 10% discount
    assert sim_30.estimated_margin < sim_10.estimated_margin
