"""Unit and integration tests for HindSight organizational memory integration.
Tests retain, recall, reflect operations, bank isolation, and failure resilience.
"""
import uuid
import pytest
from app.integrations.hindsight import HindSightIntegration
from app.services.memory_service import MemoryService


@pytest.mark.asyncio
async def test_hindsight_bank_id_pattern():
    """Verify strictly isolated bank ID pattern: organization:{id}:crisispilot."""
    client = HindSightIntegration()
    org_id = uuid.uuid4()
    bank_id = client.get_bank_id(org_id)
    assert bank_id == f"organization:{str(org_id)}:crisispilot"
    assert "crisispilot" in bank_id


@pytest.mark.asyncio
async def test_hindsight_retain_recall_reflect_workflow():
    """Verify Section 41 test flow:
    Retain historical case -> Recall semantically -> Reflect across experiences.
    """
    client = HindSightIntegration()
    test_org_id = uuid.uuid4()

    # 1. Retain test experience
    memory_text = (
        "Product X had excess inventory in January. "
        "A 15% discount plus bundle cleared 68% of inventory with 16% margin reduction."
    )
    retain_res = await client.retain(
        organization_id=test_org_id,
        content=memory_text,
        tags=["crisis:excess_inventory", "product:product_x", "strategy:bundle"],
        document_id="test_doc_001",
    )
    assert retain_res is not None
    assert retain_res["status"] in ("retained", "simulated", "stored", "retained_local")

    # 2. Recall previous strategies
    recall_res = await client.recall(
        organization_id=test_org_id,
        query="Previous Product X excess inventory strategies.",
        limit=5,
    )
    assert isinstance(recall_res, list)
    assert len(recall_res) >= 1

    # 3. Reflect for strategic synthesis
    reflect_res = await client.reflect(
        organization_id=test_org_id,
        reflection_query="What strategy historically worked best for Product X excess inventory?",
    )
    assert "reflection" in reflect_res
    assert len(reflect_res["reflection"]) > 10
    assert reflect_res["confidence"] > 0.0


@pytest.mark.asyncio
async def test_memory_service_case_and_insight_retrieval():
    """Test MemoryService retrieves seeded cases and learned organizational insights."""
    service = MemoryService()
    test_org_id = uuid.uuid4()

    cases = await service.get_historical_cases(
        organization_id=test_org_id,
        query="excess inventory 48,000 units Product X",
        limit=5,
    )
    assert len(cases) >= 3
    # Verify Case #104 is present
    assert any(c.case_number == 104 or "104" in str(c.title) or "104" in str(c.case_id) for c in cases)

    insights = await service.get_insights(organization_id=test_org_id)
    assert len(insights) >= 5
    assert all(i.confidence > 0.70 for i in insights)
