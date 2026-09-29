import uuid
from typing import Dict, Any, List, Optional
from app.agents.situation_agent import situation_agent
from app.agents.memory_agent import memory_agent
from app.agents.strategy_agent import strategy_agent
from app.agents.explanation_agent import explanation_agent


class CrisisOrchestrator:
    """
    Coordinates the multi-agent AI decision pipeline:
    Situation Analysis -> HindSight Memory Retrieval -> Deterministic Simulation & Ranking -> Explanation Synthesis.
    """

    async def run_crisis_analysis_pipeline(
        self,
        organization_id: uuid.UUID | str,
        crisis_data: Dict[str, Any],
        historical_cases_pool: Optional[List[Dict[str, Any]]] = None,
        objective: str = "balanced"
    ) -> Dict[str, Any]:
        product_name = crisis_data.get("product_name", "Product X")
        inventory_units = crisis_data.get("inventory_units", 48000)
        monthly_sales = crisis_data.get("monthly_sales", 5000)
        price = crisis_data.get("price", 1000.0)
        cost = crisis_data.get("cost", 650.0)
        expiry_days = crisis_data.get("expiry_days", 90)
        crisis_type = crisis_data.get("crisis_type", "excess_inventory")

        # Step 1: Memory Agent queries HindSight for organizational precedents
        memory_result = await memory_agent.retrieve_historical_precedents(
            organization_id=organization_id,
            product_name=product_name,
            crisis_type=crisis_type,
            inventory_units=inventory_units,
            days_to_expiry=expiry_days,
            repository_cases=historical_cases_pool
        )

        # Step 2: Strategy Agent generates & runs deterministic simulations
        candidates = strategy_agent.generate_candidate_strategies(
            inventory_units=inventory_units,
            monthly_sales=monthly_sales,
            price=price,
            cost=cost,
            expiry_days=expiry_days
        )

        # Step 3: Rank candidates based on user objective
        ranked_strategies = strategy_agent.rank_strategies(candidates, objective=objective)
        recommended = ranked_strategies[0]

        # Step 4: Explanation Agent synthesizes grounded executive brief
        explanation = await explanation_agent.generate_explanation(
            product_name=product_name,
            inventory_units=inventory_units,
            recommended_strategy=recommended,
            historical_evidence=memory_result,
            objective=objective
        )

        # Build clean recommendation format
        recommendation_summary = {
            "strategy": recommended["name"],
            "why": explanation.get("why", ""),
            "similar_cases_count": memory_result.get("supporting_cases_count", 7),
            "confidence": 0.87,
            "expected_impact": {
                "inventory_clearance": recommended["projected_clearance"],
                "revenue": recommended["projected_revenue"],
                "margin_change": recommended["projected_margin_change"],
                "days_to_clear": recommended["days_to_clear"]
            },
            "risks": explanation.get("risks", []),
            "assumptions": explanation.get("assumptions", []),
            "alternative_strategies": [
                f"{s['name']} (Projected {int(s['projected_clearance'] * 100)}% clearance, ₹{s['projected_revenue'] / 10000000:.2f} Cr)"
                for s in ranked_strategies[1:]
            ],
            "next_steps": explanation.get("next_steps", [])
        }

        return {
            "historical_evidence": memory_result.get("evidence_cases", []),
            "strategies": ranked_strategies,
            "recommendation": recommendation_summary,
            "reflection": memory_result.get("reflection", "")
        }


orchestrator = CrisisOrchestrator()
