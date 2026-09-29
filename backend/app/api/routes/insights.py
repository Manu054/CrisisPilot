from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.db.models import User
from app.services.insight_service import insight_service

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("", response_model=List[Dict[str, Any]])
async def list_insights(current_user: User = Depends(get_current_user)):
    return insight_service.get_pattern_insights()
