import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.report_service import ReportService
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    data: ReportCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = ReportService(session)
    return await service.generate_crisis_report(
        crisis_id=data.crisis_id,
        organization_id=current_user.organization_id,
        title=data.title
    )


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = ReportService(session)
    return await service.get_reports_by_org(current_user.organization_id)


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = ReportService(session)
    return await service.get_report_by_id(report_id, current_user.organization_id)
