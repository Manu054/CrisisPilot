from typing import List, Dict, Any


class InsightService:
    """
    Returns discovered patterns across the 5 core business disciplines:
    Pricing Patterns, Inventory Patterns, Regional Patterns, Seasonal Patterns, Customer Behavior.
    """

    def get_pattern_insights(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "pat-01",
                "section": "Pricing Patterns",
                "title": "Bundle Value Preservation Principle",
                "observation": "Bundle promotions preserve 64% more gross margin than equivalent percentage price cuts across consumer electronics SKUs.",
                "confidence": 0.93,
                "sample_size": "24 Historical Crises Analyzed",
                "historical_evidence": "Across Cases #104, #112, and #139, bundle structures maintained average order value above ₹1,150 while flat discounts dragged unit realization below ₹780.",
                "action_guideline": "Always test bundle packaging before approving straight discounts exceeding 12%.",
                "tag": "Pricing Rule",
                "supporting_case_ids": ["case-104", "case-112", "case-139"]
            },
            {
                "id": "pat-02",
                "section": "Customer Behavior",
                "title": "Southern Regional Bundle Receptivity",
                "observation": "Customers in South India respond 1.8x better to bundle promotions than direct discounts.",
                "confidence": 0.91,
                "sample_size": "16 Regional Campaigns",
                "historical_evidence": "Case #128 demonstrated 71% clearance in South hubs using companion bundles at standard price, whereas identical SKU discount in North showed low responsiveness.",
                "action_guideline": "Prioritize value bundling when addressing excess inventory in Bengaluru, Chennai, and Hyderabad fulfillment zones.",
                "tag": "Customer Preference",
                "supporting_case_ids": ["case-128", "case-104"]
            },
            {
                "id": "pat-03",
                "section": "Inventory Patterns",
                "title": "The 75-Day Aging Cliff",
                "observation": "Inventory remaining unsold past 75 days faces a 3.4x higher probability of total liquidation write-down.",
                "confidence": 0.95,
                "sample_size": "41 Stagnant Inventory Audits",
                "historical_evidence": "Historical records show carrying costs and dealer pushback compound non-linearly once product age exceeds 75 days, escalating write-down expenses.",
                "action_guideline": "Trigger automated intervention protocols at Day 60 to prevent reaching the 75-day terminal risk cliff.",
                "tag": "Inventory Threshold",
                "supporting_case_ids": ["case-064", "case-079"]
            },
            {
                "id": "pat-04",
                "section": "Regional Patterns",
                "title": "Inter-Hub Dynamic Supply Balancing",
                "observation": "Inter-regional freight redistribution costs average 3.2% of MSRP, vs 18–30% loss from local emergency markdowns.",
                "confidence": 0.88,
                "sample_size": "12 Freight Transfer Audits",
                "historical_evidence": "Case #87 and Case #128 proved that routing stock across zones saved ₹80L in combined inventory markdowns at a freight cost of ₹10L.",
                "action_guideline": "Run regional demand variance analysis before authorizing local price cuts on national SKU lines.",
                "tag": "Logistics Optimization",
                "supporting_case_ids": ["case-087", "case-128"]
            },
            {
                "id": "pat-05",
                "section": "Seasonal Patterns",
                "title": "Post-Monsoon Demand Rebound Variance",
                "observation": "Southern retail centers recover sales run-rates 18 days earlier than Northern distributor channels post-monsoon.",
                "confidence": 0.85,
                "sample_size": "3 Seasonal Cycles (2023–2025)",
                "historical_evidence": "Demand curves across Case #87 and historical sales registries verify consistent early consumer spending in South tech corridors.",
                "action_guideline": "Allocate early seasonal inventory batches southwards during the August–September transition window.",
                "tag": "Seasonal Dynamics",
                "supporting_case_ids": ["case-087", "case-112"]
            }
        ]


insight_service = InsightService()
