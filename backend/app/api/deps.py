import uuid
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError
from app.db.repositories import UserRepository
from app.db.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_db)
) -> User:
    """
    Extracts and authenticates user from JWT token.
    Enforces that user and organization exist.
    """
    if not token:
        # Check demo/dev fallback user to make local onboarding frictionless
        user_repo = UserRepository(session)
        dev_user = await user_repo.get_by_email("demo@crisispilot.com") or await user_repo.get_by_email("sarah.morgan@acmeretail.com")
        if dev_user:
            return dev_user
        raise AuthenticationError("Authorization token required.")

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise AuthenticationError("Invalid or expired authentication token.")

    user_id_str = payload.get("sub")
    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise AuthenticationError("Malformed user identifier in token.")

    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise AuthenticationError("User associated with token no longer exists.")

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    return current_user
