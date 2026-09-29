import re
from typing import Dict, Any, List


class SituationAgent:
    """
    Parses natural language crisis descriptions, extracts operational parameters,
    and identifies missing parameters without hallucination.
    """

    def parse_situation(self, text: str, existing_data: Dict[str, Any] = None) -> Dict[str, Any]:
        data = existing_data.copy() if existing_data else {}
        text_lower = text.lower()

        # Extract unit counts (e.g., 48,000 units or 48k units)
        unit_match = re.search(r"(\d+[\d,]*)\s*(?:unsold\s*)?units", text_lower)
        if unit_match and "inventory_units" not in data:
            units_raw = unit_match.group(1).replace(",", "")
            data["inventory_units"] = int(units_raw)

        # Extract monthly sales run rate (e.g. 5,000 units/mo or monthly sales are 5,000)
        sales_match = re.search(r"(?:monthly\s*sales\s*(?:are\s*)?|run[\s-]*rate\s*(?:is\s*)?)(\d+[\d,]*)", text_lower)
        if sales_match and "monthly_sales" not in data:
            data["monthly_sales"] = int(sales_match.group(1).replace(",", ""))

        # Extract expiry days (e.g. 90 days)
        expiry_match = re.search(r"(\d+)\s*days\s*(?:until\s*expiry|remaining|shelf[\s-]*life|runway)", text_lower)
        if expiry_match and "expiry_days" not in data:
            data["expiry_days"] = int(expiry_match.group(1))

        # Extract product name
        prod_match = re.search(r"product\s+([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
        if prod_match and "product_name" not in data:
            data["product_name"] = f"Product {prod_match.group(1).upper()}"

        # Classify crisis type
        if "excess" in text_lower or "unsold" in text_lower or "overstock" in text_lower:
            crisis_type = "excess_inventory"
        elif "competitor" in text_lower and ("cut" in text_lower or "price" in text_lower or "discount" in text_lower):
            crisis_type = "competitor_price_cut"
        elif "drop" in text_lower or "falling" in text_lower or "slowdown" in text_lower:
            crisis_type = "falling_sales"
        elif "region" in text_lower or "depot" in text_lower or "warehouse" in text_lower:
            crisis_type = "regional_imbalance"
        elif "seasonal" in text_lower or "monsoon" in text_lower or "holiday" in text_lower:
            crisis_type = "seasonal_demand"
        else:
            crisis_type = "excess_inventory"

        data["crisis_type"] = data.get("crisis_type", crisis_type)

        # Check required fields
        required_fields = ["inventory_units", "monthly_sales", "price", "cost", "expiry_days"]
        missing_information = [f for f in required_fields if f not in data]

        return {
            "parsed_data": data,
            "missing_information": missing_information,
            "is_complete": len(missing_information) == 0
        }


situation_agent = SituationAgent()
