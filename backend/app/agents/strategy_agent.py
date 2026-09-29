from typing import List, Dict, Any
from app.utils.calculations import simulate_strategy_metrics


class StrategyAgent:
    """
    Generates candidate resolution strategies and uses deterministic simulations
    to rank them dynamically based on user-selected business objectives.
    """

    def generate_candidate_strategies(
        self,
        inventory_units: int,
        monthly_sales: int,
        price: float,
        cost: float,
        expiry_days: int
    ) -> List[Dict[str, Any]]:
        """
        Generates candidate strategies tailored to the product's operational parameters.
        """
        candidates = [
            {
                "id": "strat-bundle-15",
                "name": "15% Targeted Discount + Bundle Promotion",
                "strategy_type": "bundle",
                "badge": "AI Recommended",
                "discount_percentage": 0.15,
                "promotion_duration_days": 60,
                "promotion_lift": 1.45,  # Bundling increases perceived value
                "campaign_budget": 850000.0,
                "description": "Provide a 15% discount voucher when purchased with high-margin companion accessories.",
                "actions": [
                    "Activate 15% promotional pricing across tier-1 e-commerce and retail partners",
                    "Bundle with fast-moving companion accessory kit (perceived value ₹650, wholesale cost ₹180)",
                    "Pre-notify 120 key channel partners with 14-day lead time",
                    "Set automated liquidation checkpoints at Day 20, 40, and 60"
                ]
            },
            {
                "id": "strat-disc-10",
                "name": "10% Conservative Markdown",
                "strategy_type": "discount",
                "badge": "Margin Preserving",
                "discount_percentage": 0.10,
                "promotion_duration_days": 90,
                "promotion_lift": 1.10,
                "campaign_budget": 400000.0,
                "description": "Modest price cut preserving maximum unit gross margin, relying on baseline organic demand.",
                "actions": [
                    "Apply flat 10% markdown across direct D2C portal and flagship stores",
                    "Run targeted email marketing to past category purchasers",
                    "Maintain existing dealer wholesale terms without volume incentives"
                ]
            },
            {
                "id": "strat-disc-20",
                "name": "20% Direct Price Cut",
                "strategy_type": "discount",
                "badge": "High Velocity",
                "discount_percentage": 0.20,
                "promotion_duration_days": 35,
                "promotion_lift": 1.70,
                "campaign_budget": 1200000.0,
                "description": "Broad market price slash to rapidly liquidate units through open marketplaces before seasonal cutoff.",
                "actions": [
                    "Broadcast 20% flat markdown across Amazon, Flipkart, and Croma",
                    "Execute flash sale marketing blitz across social search",
                    "Provide price protection credits to top distribution accounts"
                ]
            },
            {
                "id": "strat-regional",
                "name": "Regional Redistribution to High-Velocity Hubs",
                "strategy_type": "redistribution",
                "badge": "Supply Rebalance",
                "discount_percentage": 0.05,
                "promotion_duration_days": 45,
                "promotion_lift": 1.30,
                "campaign_budget": 580000.0,
                "description": "Transfer units from stagnant depots to South and East zones where baseline sell-through is elevated.",
                "actions": [
                    "Initiate inter-state transfer of 18,000 units to Bengaluru and Hyderabad depots",
                    "Support regional channel partners with co-op local merchandising funds",
                    "Hold MSRP firm in recipient regions where stock velocity remains elevated"
                ]
            }
        ]

        # Deterministically run simulations for each candidate
        evaluated_strategies = []
        for strat in candidates:
            sim = simulate_strategy_metrics(
                inventory_units=inventory_units,
                monthly_sales=monthly_sales,
                price=price,
                cost=cost,
                expiry_days=expiry_days,
                discount_percentage=strat["discount_percentage"],
                promotion_duration_days=strat["promotion_duration_days"],
                promotion_lift=strat["promotion_lift"],
                campaign_budget=strat["campaign_budget"]
            )
            evaluated_strategies.append({
                **strat,
                "projected_clearance": sim["inventory_clearance_percentage"],
                "cleared_units": sim["cleared_units"],
                "remaining_units": sim["remaining_inventory"],
                "projected_revenue": sim["estimated_revenue"],
                "projected_margin_change": sim["estimated_margin_change"],
                "effective_margin_percent": sim["estimated_margin"],
                "days_to_clear": sim["estimated_clearance_days"],
                "risk_score": sim["risk_score"],
                "timeline_projection": sim["timeline_projection"]
            })

        return evaluated_strategies

    def rank_strategies(self, evaluated_strategies: List[Dict[str, Any]], objective: str = "balanced") -> List[Dict[str, Any]]:
        """
        Ranks strategies dynamically according to selected business objective:
        - maximize_clearance: prioritizes clearance %
        - protect_margin: prioritizes effective margin %
        - maximize_revenue: prioritizes projected revenue
        - minimize_time: prioritizes lowest days to clear
        - minimize_risk: penalizes high risk scores
        - balanced: multi-criteria optimization
        """
        def score(s: Dict[str, Any]) -> float:
            clearance = s["projected_clearance"]
            margin = s["effective_margin_percent"] / 100.0
            rev_norm = min(1.0, s["projected_revenue"] / 50000000.0)
            speed = 1.0 - (s["days_to_clear"] / 120.0)
            risk_penalty = 0.25 if s["risk_score"] == "High" else (0.10 if s["risk_score"] == "Moderate" else 0.0)

            if objective == "maximize_clearance":
                return (clearance * 0.70) + (margin * 0.20) + (speed * 0.10) - (risk_penalty * 0.5)
            elif objective == "protect_margin":
                return (margin * 0.65) + (clearance * 0.25) - risk_penalty
            elif objective == "maximize_revenue":
                return (rev_norm * 0.60) + (clearance * 0.25) + (margin * 0.15) - risk_penalty
            elif objective == "minimize_time":
                return (speed * 0.60) + (clearance * 0.30) - risk_penalty
            elif objective == "minimize_risk":
                return (clearance * 0.30) + (margin * 0.40) - (risk_penalty * 1.5)
            else:  # balanced
                return (clearance * 0.40) + (margin * 0.35) + (rev_norm * 0.15) + (speed * 0.10) - risk_penalty

        ranked = sorted(evaluated_strategies, key=score, reverse=True)
        # Mark top ranked as recommended
        for idx, item in enumerate(ranked):
            item["is_recommended"] = (idx == 0)
        return ranked


strategy_agent = StrategyAgent()
