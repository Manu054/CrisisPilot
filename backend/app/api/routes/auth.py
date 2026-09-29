from datetime import timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.repositories import UserRepository, OrganizationRepository
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import AuthenticationError, AppException
from app.api.deps import get_current_user
from app.db.models import User
from app.schemas.auth import LoginRequest, RegisterRequest, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_db)):
    user_repo = UserRepository(session)
    existing_user = await user_repo.get_by_email(data.email)
    if existing_user:
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="EMAIL_ALREADY_EXISTS",
            message="An account with this email address already exists."
        )

    org_repo = OrganizationRepository(session)
    org = await org_repo.create(
        name=data.organization_name,
        industry=data.industry,
        currency=data.currency or "INR"
    )

    hashed_pw = get_password_hash(data.password)
    user = await user_repo.create(
        organization_id=org.id,
        name=data.name,
        email=data.email,
        password_hash=hashed_pw,
        role=data.role or "admin"
    )

    await session.commit()
    await session.refresh(user)

    token = create_access_token(
        subject=str(user.id),
        organization_id=str(user.organization_id),
        role=user.role
    )

    return Token(
        access_token=token,
        user_id=user.id,
        organization_id=user.organization_id,
        name=user.name,
        email=user.email,
        role=user.role
    )


@router.post("/login", response_model=Token)
async def login(data: LoginRequest, session: AsyncSession = Depends(get_db)):
    user_repo = UserRepository(session)
    user = await user_repo.get_by_email(data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise AuthenticationError("Invalid email or password.")

    token = create_access_token(
        subject=str(user.id),
        organization_id=str(user.organization_id),
        role=user.role
    )

    return Token(
        access_token=token,
        user_id=user.id,
        organization_id=user.organization_id,
        name=user.name,
        email=user.email,
        role=user.role
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
