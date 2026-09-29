"""API Integration and Multi-Tenant Isolation Tests.
Verifies auth, crisis lifecycle, simulation comparison, and organization data isolation.
"""
import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import AsyncSessionLocal, init_db
from app.db.models import Organization, User, Crisis
from app.core.security import get_password_hash, create_access_token


@pytest.fixture(autouse=True)
async def setup_test_db():
    await init_db()


@pytest.mark.asyncio
async def test_health_endpoints():
    """Verify system observability endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert "hindsight" in data

        res_ready = await client.get("/health/ready")
        assert res_ready.status_code == 200
        assert res_ready.json()["status"] == "ready"


@pytest.mark.asyncio
async def test_auth_login_and_me():
    """Verify demo user login and /api/auth/me profile."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Login with seeded admin user
        login_res = await client.post(
            "/api/auth/login",
            json={"email": "demo@crisispilot.com", "password": "Password123!"},
        )
        assert login_res.status_code == 200
        tokens = login_res.json()
        assert "access_token" in tokens
        token = tokens["access_token"]

        # Fetch current user
        me_res = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_res.status_code == 200
        user_profile = me_res.json()
        assert user_profile["email"] == "demo@crisispilot.com"
        assert user_profile["role"] == "admin"


@pytest.mark.asyncio
async def test_multi_tenant_isolation():
    """CRITICAL TEST: Verify that Organization A cannot access Organization B data.
    Enforces section 27 and 39 multi-tenant boundaries.
    """
    transport = ASGITransport(app=app)

    # 1. Create two distinct organizations and users in DB
    org_a_id = uuid.uuid4()
    org_b_id = uuid.uuid4()
    user_a_id = uuid.uuid4()
    user_b_id = uuid.uuid4()

    async with AsyncSessionLocal() as session:
        org_a = Organization(id=org_a_id, name="Company Alpha")
        org_b = Organization(id=org_b_id, name="Company Beta")
        user_a = User(
            id=user_a_id,
            organization_id=org_a_id,
            name="Alice Alpha",
            email=f"alice_{uuid.uuid4().hex[:6]}@alpha.com",
            password_hash=get_password_hash("Secret123!"),
            role="admin",
        )
        user_b = User(
            id=user_b_id,
            organization_id=org_b_id,
            name="Bob Beta",
            email=f"bob_{uuid.uuid4().hex[:6]}@beta.com",
            password_hash=get_password_hash("Secret123!"),
            role="admin",
        )
        # Create a private crisis inside Organization B
        crisis_b = Crisis(
            organization_id=org_b_id,
            title="Confidential Price Crisis - Beta",
            crisis_type="competitor_price_cut",
            description="Highly sensitive competitor cut in Beta territory.",
            severity="critical",
            status="analyzing",
            input_data={"inventory": 10000},
            created_by=user_b_id,
        )
        session.add_all([org_a, org_b, user_a, user_b, crisis_b])
        await session.commit()
        crisis_b_id = crisis_b.id

    token_a = create_access_token(user_id=user_a_id, organization_id=org_a_id, role="admin")

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # User A attempts to view Crisis B owned by Organization B
        unauthorized_res = await client.get(
            f"/api/crises/{crisis_b_id}",
            headers={"Authorization": f"Bearer {token_a}"},
        )
        # Must return 404 or 403, NEVER the data of Org B
        assert unauthorized_res.status_code in (404, 403)


@pytest.mark.asyncio
async def test_simulations_comparison_api():
    """Verify simulation scenario comparison endpoint."""
    token = create_access_token(
        user_id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        organization_id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        role="admin",
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "inventory_units": 48000,
            "monthly_sales": 5000,
            "price": 1000.0,
            "cost": 650.0,
            "expiry_days": 90,
            "scenarios": [
                {"name": "Scenario 1: 10% Discount", "discount_percentage": 0.10, "promotion_lift": 1.25, "promotion_duration_days": 60},
                {"name": "Scenario 2: 15% Bundle", "discount_percentage": 0.15, "promotion_lift": 1.45, "promotion_duration_days": 60},
                {"name": "Scenario 3: 20% Direct Clearance", "discount_percentage": 0.20, "promotion_lift": 1.65, "promotion_duration_days": 60},
            ],
        }
        res = await client.post(
            "/api/simulations/compare",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200
        comparison = res.json()
        assert "product" in comparison
        assert "scenarios" in comparison
        assert len(comparison["scenarios"]) == 3
        # Verify Recharts timeline data is embedded in each scenario's result
        first_scenario = comparison["scenarios"][0]
        assert "result" in first_scenario
        assert "timeline_projection" in first_scenario["result"]
        assert len(first_scenario["result"]["timeline_projection"]) == 7


@pytest.mark.asyncio
async def test_dashboard_summary_api():
    """Verify dashboard summary metrics for Acme Retail."""
    token = create_access_token(
        user_id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        organization_id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        role="admin",
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get(
            "/api/dashboard/summary",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200
        data = res.json()
        assert "total_inventory" in data
        assert "at_risk_inventory" in data
        assert "monitored_skus" in data
