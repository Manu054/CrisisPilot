"""Database and HindSight Memory Seeding Script.
Populates Acme Retail demo organization, products, 12-month sales data, inventory snapshots,
historical crises, decisions, outcomes, simulations, and HindSight organizational memories.
Run with: python -m app.seed
"""
import asyncio
import datetime
import uuid
from sqlalchemy import select
from app.db.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.core.logging import logger
from app.integrations.hindsight import hindsight_client
from app.services.memory_service import MemoryService
from app.utils.calculations import simulate_strategy
from app.db.models import (
    Organization,
    User,
    Product,
    InventorySnapshot,
    SalesRecord,
    Crisis,
    Strategy,
    Decision,
    Simulation,
    Recommendation,
    Outcome,
    Notification,
)

# Standard Seed UUIDs
ORG_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
USER_ID = uuid.UUID("22222222-2222-2222-2222-222222222222")
PRD_X_ID = uuid.UUID("33333333-3333-3333-3333-333333333331")
PRD_Y_ID = uuid.UUID("33333333-3333-3333-3333-333333333332")
PRD_Z_ID = uuid.UUID("33333333-3333-3333-3333-333333333333")
ACTIVE_CRISIS_ID = uuid.UUID("44444444-4444-4444-4444-444444444444")


async def seed():
    """Main seed function."""
    logger.info("Starting CrisisPilot database and HindSight memory seed...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # 1. Organization
        existing_org = await session.get(Organization, ORG_ID)
        if not existing_org:
            org = Organization(
                id=ORG_ID,
                name="Acme Retail",
                industry="Consumer Electronics & Retail",
                currency="INR",
                timezone="Asia/Kolkata",
            )
            session.add(org)
            logger.info("Created organization: Acme Retail")
        else:
            org = existing_org

        # 2. Demo User
        existing_user = await session.get(User, USER_ID)
        if not existing_user:
            user = User(
                id=USER_ID,
                organization_id=ORG_ID,
                name="Demo Administrator",
                email="demo@crisispilot.com",
                password_hash=get_password_hash("Password123!"),
                role="admin",
            )
            session.add(user)
            logger.info("Created user: Demo Administrator (admin)")

        # 3. Products
        products_data = [
            {
                "id": PRD_X_ID,
                "sku": "SKU-PRD-X",
                "name": "Product X",
                "category": "Smart Electronics",
                "price": 1000.0,
                "cost": 650.0,
                "expiry_days": 90,
            },
            {
                "id": PRD_Y_ID,
                "sku": "SKU-PRD-Y",
                "name": "Product Y",
                "category": "Home Appliances",
                "price": 2400.0,
                "cost": 1600.0,
                "expiry_days": 180,
            },
            {
                "id": PRD_Z_ID,
                "sku": "SKU-PRD-Z",
                "name": "Product Z",
                "category": "Apparel & Accessories",
                "price": 850.0,
                "cost": 400.0,
                "expiry_days": 60,
            },
        ]
        for pdata in products_data:
            existing_p = await session.get(Product, pdata["id"])
            if not existing_p:
                session.add(Product(organization_id=ORG_ID, **pdata))
        logger.info("Created Products: Product X, Product Y, Product Z")

        # 4. Inventory Snapshots
        regions = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi NCR", "Chennai"]
        for p in products_data:
            for region in regions:
                snapshot = InventorySnapshot(
                    organization_id=ORG_ID,
                    product_id=p["id"],
                    region=region,
                    units_available=9600 if p["id"] == PRD_X_ID and region == "Hyderabad" else 3500,
                    units_committed=400,
                    units_in_transit=250,
                    snapshot_date=datetime.date.today(),
                )
                session.add(snapshot)

        # 5. Sales Records (12 Months)
        today = datetime.date.today()
        for month_offset in range(12, 0, -1):
            record_date = today - datetime.timedelta(days=month_offset * 30)
            for p in products_data:
                session.add(
                    SalesRecord(
                        organization_id=ORG_ID,
                        product_id=p["id"],
                        region="Hyderabad",
                        date=record_date,
                        units_sold=5000 if p["id"] == PRD_X_ID else 2800,
                        revenue=(5000 if p["id"] == PRD_X_ID else 2800) * p["price"],
                        average_price=p["price"],
                    )
                )

        # 6. Historical Crises, Decisions, and Real Outcomes
        historical_crises_specs = [
            {
                "title": "Historical Case #104: Q3 Excess Stock - Product X",
                "type": "excess_inventory",
                "product_id": PRD_X_ID,
                "severity": "high",
                "status": "resolved",
                "strategy_name": "15% Targeted Discount + Bundle Promotion",
                "strategy_type": "bundle",
                "parameters": {"discount_percentage": 0.15, "bundle_item": "Accessories Kit", "duration_days": 60},
                "outcome": {
                    "cleared": 0.68,
                    "revenue": 32640000,
                    "margin": -0.16,
                    "time_to_clear": 54,
                    "response": "Excellent customer uptake; accessories bundle absorbed perceived value reduction.",
                    "notes": "Bundling with high-margin accessory cushioned gross margin drop to 16% while clearing 68% stock.",
                },
            },
            {
                "title": "Historical Case #112: Aggressive Price Cut Experiment",
                "type": "excess_inventory",
                "product_id": PRD_X_ID,
                "severity": "critical",
                "status": "resolved",
                "strategy_name": "30% Direct Price Slash",
                "strategy_type": "discount",
                "parameters": {"discount_percentage": 0.30, "duration_days": 45},
                "outcome": {
                    "cleared": 0.80,
                    "revenue": 26880000,
                    "margin": -0.34,
                    "time_to_clear": 38,
                    "response": "Fast volume clearance, but severe brand degradation and retailer margin complaints.",
                    "notes": "Deep 30% discount cleared 80% volume rapidly, but resulted in unsustainable 34% margin destruction.",
                },
            },
            {
                "title": "Historical Case #79: Regional Stock Redistribution",
                "type": "regional_imbalance",
                "product_id": PRD_X_ID,
                "severity": "medium",
                "status": "resolved",
                "strategy_name": "Cross-Regional Inventory Reallocation",
                "strategy_type": "redistribution",
                "parameters": {"source_region": "Hyderabad", "target_regions": ["Bengaluru", "Mumbai"], "units_transferred": 12000},
                "outcome": {
                    "cleared": 0.72,
                    "revenue": 34560000,
                    "margin": -0.06,
                    "time_to_clear": 62,
                    "response": "Very strong demand in target tier-1 tech metros. Logistics transit cost was 4.2% of revenue.",
                    "notes": "Moving 12,000 units from low-demand to high-demand metros preserved margin with only logistics friction.",
                },
            },
            {
                "title": "Historical Case #128: Competitor Seasonal Price War",
                "type": "competitor_price_cut",
                "product_id": PRD_Y_ID,
                "severity": "high",
                "status": "resolved",
                "strategy_name": "Selective Channel Shift & Retailer Margin Rebate",
                "strategy_type": "channel_shift",
                "parameters": {"direct_d2c_boost": 0.40, "retail_spiff": 0.08},
                "outcome": {
                    "cleared": 0.64,
                    "revenue": 41200000,
                    "margin": -0.11,
                    "time_to_clear": 48,
                    "response": "Avoided matching competitor directly in retail aisles; D2C exclusive bundles captured premium buyers.",
                    "notes": "Countered competitor price cuts with D2C channel prioritization without permanently impairing list prices.",
                },
            },
            {
                "title": "Historical Case #64: Flash Sale Liquidation Experiment",
                "type": "excess_inventory",
                "product_id": PRD_Z_ID,
                "severity": "critical",
                "status": "resolved",
                "strategy_name": "72-Hour Flash Liquidation Event",
                "strategy_type": "liquidation",
                "parameters": {"discount_percentage": 0.35, "duration_hours": 72},
                "outcome": {
                    "cleared": 0.88,
                    "revenue": 14200000,
                    "margin": -0.42,
                    "time_to_clear": 3,
                    "response": "Massive consumer traffic surge, server stress, but severe post-campaign sales freeze for 4 weeks.",
                    "notes": "Emergency liquidation cleared 88% in 3 days; use solely for imminent expiry hazards due to demand cannibalization.",
                },
            },
        ]

        for h_spec in historical_crises_specs:
            c = Crisis(
                organization_id=ORG_ID,
                product_id=h_spec["product_id"],
                title=h_spec["title"],
                crisis_type=h_spec["type"],
                description=f"Automated resolution record for {h_spec['title']}",
                severity=h_spec["severity"],
                status=h_spec["status"],
                input_data={"product_name": "Product X", "initial_inventory": 48000, "region": "Hyderabad"},
                created_by=USER_ID,
            )
            session.add(c)
            await session.flush()

            d = Decision(
                crisis_id=c.id,
                organization_id=ORG_ID,
                strategy_type=h_spec["strategy_type"],
                parameters=h_spec["parameters"],
                expected_outcome={"clearance": h_spec["outcome"]["cleared"], "margin_change": h_spec["outcome"]["margin"]},
                actual_outcome=h_spec["outcome"],
                status="completed",
                executed_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=90),
                completed_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30),
            )
            session.add(d)
            await session.flush()

            session.add(
                Outcome(
                    decision_id=d.id,
                    organization_id=ORG_ID,
                    inventory_cleared=h_spec["outcome"]["cleared"],
                    revenue=float(h_spec["outcome"]["revenue"]),
                    margin=float(h_spec["outcome"]["margin"]),
                    customer_response=h_spec["outcome"]["response"],
                    time_to_clear=h_spec["outcome"]["time_to_clear"],
                    notes=h_spec["outcome"]["notes"],
                )
            )

        # 7. Seed The Core Demo Crisis (Product X, 48,000 units, 90 days expiry)
        existing_demo = await session.get(Crisis, ACTIVE_CRISIS_ID)
        if not existing_demo:
            demo_crisis = Crisis(
                id=ACTIVE_CRISIS_ID,
                organization_id=ORG_ID,
                product_id=PRD_X_ID,
                title="Excess Inventory Crisis - Product X (Hyderabad Q3)",
                crisis_type="excess_inventory",
                description=(
                    "48,000 units of Product X remain unsold with 90 days until expiry in the Hyderabad regional warehouse. "
                    "Current run-rate of 5,000 units/month leaves 33,000 units at risk of expiration."
                ),
                severity="high",
                status="recommendation_ready",
                input_data={
                    "product_name": "Product X",
                    "inventory_units": 48000,
                    "monthly_sales": 5000,
                    "price": 1000.0,
                    "cost": 650.0,
                    "expiry_days": 90,
                    "region": "Hyderabad",
                    "objective": "balanced",
                },
                created_by=USER_ID,
            )
            session.add(demo_crisis)
            await session.flush()

            # Run deterministic simulations for the demo crisis
            candidate_scenarios = [
                {"name": "Scenario A: 10% Discount", "discount": 0.10, "lift": 0.25, "days": 60, "redist": 0},
                {"name": "Scenario B: 15% Targeted Discount + Bundle", "discount": 0.15, "lift": 0.45, "days": 60, "redist": 0},
                {"name": "Scenario C: 20% Direct Clearance", "discount": 0.20, "lift": 0.65, "days": 60, "redist": 0},
                {"name": "Scenario D: Regional Redistribution (60/40)", "discount": 0.05, "lift": 0.50, "days": 60, "redist": 15000},
            ]

            sim_models = []
            for sc in candidate_scenarios:
                calc = simulate_strategy(
                    inventory_units=48000,
                    monthly_sales=5000,
                    price=1000.0,
                    cost=650.0,
                    expiry_days=90,
                    discount_percentage=sc["discount"],
                    promotion_duration_days=sc["days"],
                    promotion_lift=sc["lift"],
                    regional_allocation=sc["redist"],
                    campaign_budget=250000.0,
                )
                sim_record = Simulation(
                    crisis_id=ACTIVE_CRISIS_ID,
                    organization_id=ORG_ID,
                    name=sc["name"],
                    parameters=sc,
                    projected_inventory_clearance=calc.inventory_clearance_percentage,
                    projected_revenue=calc.estimated_revenue,
                    projected_margin=calc.estimated_margin,
                    projected_time_to_clear=calc.estimated_clearance_days,
                    risk_score=calc.risk_score,
                )
                session.add(sim_record)
                sim_models.append((sc, calc))

            # Store recommendation
            rec = Recommendation(
                crisis_id=ACTIVE_CRISIS_ID,
                organization_id=ORG_ID,
                recommendation_text="15% Targeted Discount + Bundle Promotion",
                reasoning=(
                    "Historical precedent (Case #104) demonstrates that a 15% discount combined with an accessory bundle "
                    "achieved 68% clearance while preserving gross margins within 16%. In contrast, aggressive 30% price slashing "
                    "(Case #112) led to severe 34% margin degradation. Scenario B clears 72% of inventory within 60 days safely "
                    "ahead of the 90-day expiry threshold."
                ),
                confidence=0.89,
                expected_impact={
                    "inventory_clearance": 0.72,
                    "revenue": 36000000,
                    "margin_change": -0.18,
                    "days_to_clear": 60,
                },
                risks=[
                    {"risk": "Retailer margin conflict", "severity": "medium", "mitigation": "Provide co-op advertising allowance"},
                    {"risk": "Accessory bundle availability", "severity": "low", "mitigation": "Verify tier-2 supplier lead times"},
                ],
                historical_evidence=[
                    {
                        "case_id": "CASE-104",
                        "title": "Historical Case #104: Product X Q3 Excess Stock",
                        "strategy": "15% Targeted Discount + Bundle",
                        "cleared": "68%",
                        "margin_impact": "-16%",
                        "relevance": 0.94,
                    },
                    {
                        "case_id": "CASE-79",
                        "title": "Historical Case #79: Regional Stock Redistribution",
                        "strategy": "Metro reallocation",
                        "cleared": "72%",
                        "margin_impact": "-6%",
                        "relevance": 0.88,
                    },
                ],
            )
            session.add(rec)
            logger.info("Created Demo Crisis, 4 Deterministic Simulations, and AI Recommendation for Product X")

        # 8. Notifications
        session.add(
            Notification(
                organization_id=ORG_ID,
                related_crisis_id=ACTIVE_CRISIS_ID,
                title="Urgent: Excess Inventory Threshold Exceeded",
                message="Product X in Hyderabad regional hub has reached 48,000 units with only 90 days runway.",
                type="warning",
                read=False,
            )
        )
        session.add(
            Notification(
                organization_id=ORG_ID,
                related_crisis_id=ACTIVE_CRISIS_ID,
                title="Recommendation Ready",
                message="AI Decision Engine has synthesized 7 historical cases and produced a recommended action plan.",
                type="info",
                read=False,
            )
        )

        await session.commit()
        logger.info("Database committed successfully.")

    # 9. Seed HindSight Organizational Memory Bank
    logger.info("Seeding HindSight Organizational Memory Bank...")
    mem_service = MemoryService()

    # Retain the 3 primary demo historical stories
    await mem_service.retain_outcome(
        organization_id=ORG_ID,
        decision_id=uuid.uuid4(),
        strategy_name="15% Targeted Discount + Bundle Promotion",
        product_name="Product X",
        actual_clearance=0.68,
        actual_revenue=32640000.0,
        margin_change=-0.16,
        time_to_clear=54,
        business_lesson="For Product X, combining a 15% discount with a bundled accessory cleared 68% of inventory in 54 days while preserving margins significantly better than direct price cuts.",
        region="Hyderabad",
    )

    await mem_service.retain_outcome(
        organization_id=ORG_ID,
        decision_id=uuid.uuid4(),
        strategy_name="30% Direct Price Slash",
        product_name="Product X",
        actual_clearance=0.80,
        actual_revenue=26880000.0,
        margin_change=-0.34,
        time_to_clear=38,
        business_lesson="Aggressive 30% discounts clear volume quickly (80% in 38 days) but cause severe 34% margin destruction and channel partner complaints.",
        region="Hyderabad",
    )

    await mem_service.retain_outcome(
        organization_id=ORG_ID,
        decision_id=uuid.uuid4(),
        strategy_name="Cross-Regional Inventory Reallocation",
        product_name="Product X",
        actual_clearance=0.72,
        actual_revenue=34560000.0,
        margin_change=-0.06,
        time_to_clear=62,
        business_lesson="Reallocating surplus stock from Hyderabad to Bengaluru and Mumbai metros cleared 72% inventory while maintaining full list price, incurring only a 4.2% logistics freight expense.",
        region="Bengaluru, Mumbai",
    )

    # Retain core organizational insights
    await mem_service.retain_insight(
        organization_id=ORG_ID,
        insight_text="Bundle promotions consistently outperform direct discounts for Product X by preserving margin while accelerating unit clearance.",
        confidence=0.92,
        supporting_cases_count=5,
        related_products=["Product X"],
        related_strategies=["bundle", "discount"],
    )

    await mem_service.retain_insight(
        organization_id=ORG_ID,
        insight_text="Direct price discounts exceeding 20% trigger severe margin destruction with minimal incremental volume acceleration.",
        confidence=0.88,
        supporting_cases_count=4,
        related_products=["Product X", "Product Y"],
        related_strategies=["discount"],
    )

    logger.info("=" * 60)
    logger.info("CRISIS PILOT SEED COMPLETE!")
    logger.info(f"Organization ID: {ORG_ID} ('Acme Retail')")
    logger.info("User Login: demo@crisispilot.com / Password123!")
    logger.info(f"Active Demo Crisis ID: {ACTIVE_CRISIS_ID}")
    logger.info("HindSight Memory Bank: organization:" + str(ORG_ID) + ":crisispilot")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(seed())
