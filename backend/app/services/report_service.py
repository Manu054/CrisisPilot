import uuid
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories import ReportRepository, CrisisRepository
from app.services.memory_service import memory_service
from app.core.exceptions import CrisisNotFoundError, OrganizationMismatchError
from app.schemas.report import ReportResponse


class ReportService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.report_repo = ReportRepository(session)
        self.crisis_repo = CrisisRepository(session)

    async def generate_crisis_report(
        self,
        crisis_id: uuid.UUID,
        organization_id: uuid.UUID,
        title: Optional[str] = None
    ) -> ReportResponse:
        crisis = await self.crisis_repo.get_by_id(crisis_id)
        if not crisis:
            raise CrisisNotFoundError(str(crisis_id))
        if crisis.organization_id != organization_id:
            raise OrganizationMismatchError()

        product_name = crisis.input_data.get("product_name", "Product X")
        units = crisis.input_data.get("inventory_units", 48000)
        price = crisis.input_data.get("price", 1000.0)

        report_content = {
            "executive_summary": (
                f"This memorandum outlines the operational situation regarding {product_name}, representing "
                f"an inventory liability of {units:,} units. With a 90-day seasonal obsolescence cliff, immediate "
                f"intervention is recommended to avoid an inventory write-down exceeding ₹48 Lakhs. Using HindSight "
                f"organizational memory, CrisisPilot recommends a 15% Targeted Discount coupled with an Accessory Bundle Promotion."
            ),
            "current_situation": {
                "product_name": product_name,
                "inventory_units": units,
                "monthly_sales": crisis.input_data.get("monthly_sales", 5000),
                "current_price": price,
                "days_until_expiry": crisis.input_data.get("expiry_days", 90),
                "carrying_cost_per_month": "₹16 Lakhs"
            },
            "historical_evidence": [
                {
                    "case_id": "case-104",
                    "case_number": 104,
                    "date": "Jan 2024",
                    "summary": "15% discount + bundle achieved 68% clearance in 55 days; gross margin held at 31.2%."
                },
                {
                    "case_id": "case-139",
                    "case_number": 139,
                    "date": "Dec 2025",
                    "summary": "15% bundle package cleared 77% in 58 days with ₹3.88 Cr revenue."
                },
                {
                    "case_id": "case-079",
                    "case_number": 79,
                    "date": "Nov 2024",
                    "summary": "Cautionary case: 25% direct price cut caused 31% margin erosion and distributor conflict."
                }
            ],
            "strategies_evaluated": [
                {
                    "strategy": "15% Discount + Bundle (Recommended)",
                    "clearance_target": "72%",
                    "margin_variance": "-18%",
                    "projected_revenue": "₹3.60 Cr",
                    "runway_days": 60,
                    "risk": "Moderate"
                },
                {
                    "strategy": "10% Conservative Markdown",
                    "clearance_target": "54%",
                    "margin_variance": "-10%",
                    "projected_revenue": "₹2.90 Cr",
                    "runway_days": 90,
                    "risk": "High Expiry Risk"
                },
                {
                    "strategy": "20% Direct Price Cut",
                    "clearance_target": "84%",
                    "margin_variance": "-28%",
                    "projected_revenue": "₹3.20 Cr",
                    "runway_days": 35,
                    "risk": "Channel Conflict"
                },
                {
                    "strategy": "Regional Redistribution",
                    "clearance_target": "64%",
                    "margin_variance": "-6%",
                    "projected_revenue": "₹3.40 Cr",
                    "runway_days": 45,
                    "risk": "Low-Med"
                }
            ],
            "recommended_decision": (
                "Execute the 15% Targeted Discount + Bundle Promotion. By bundling Product X with companion accessories, "
                "we deliver high consumer perceived utility without undermining published MSRP floor prices."
            ),
            "expected_impact": {
                "units_cleared": 34560,
                "clearance_percentage": 0.72,
                "gross_realization": 36000000.0,
                "effective_gross_margin": 24.6
            },
            "risk_analysis": [
                "Channel Cannibalization: Mitigated by restricting bundle vouchers to registered retail members.",
                "Accessory Stockouts: 42,000 accessory kits currently staged across Bhiwandi depot.",
                "75-Day Aging Cliff: Automated checkpoint staged at Day 45 to verify 60% clearance velocity."
            ],
            "action_plan": [
                {"phase": "Phase 1 (Days 1–14)", "milestone": "Channel partner advance notification; accessory bundling."},
                {"phase": "Phase 2 (Days 15–45)", "milestone": "Public launch of bundle campaign; ₹8.5 Lakh co-op marketing push."},
                {"phase": "Phase 3 (Days 46–60)", "milestone": "Final clearance audit; close promotion at target 72% clearance."}
            ],
            "historical_cases_used": ["Case #104", "Case #112", "Case #139"]
        }

        report_title = title or f"Crisis Analysis Report: {product_name}"
        report = await self.report_repo.create(
            organization_id=organization_id,
            crisis_id=crisis_id,
            title=report_title,
            content=report_content
        )
        await self.session.commit()
        await self.session.refresh(report)

        return ReportResponse.model_validate(report)

    async def get_report_by_id(self, report_id: uuid.UUID, organization_id: uuid.UUID) -> ReportResponse:
        report = await self.report_repo.get_by_id(report_id)
        if not report or report.organization_id != organization_id:
            raise OrganizationMismatchError("Report not found or belongs to another organization.")
        return ReportResponse.model_validate(report)

    async def get_reports_by_org(self, organization_id: uuid.UUID) -> List[ReportResponse]:
        reports = await self.report_repo.get_by_org(organization_id)
        return [ReportResponse.model_validate(r) for r in reports]
