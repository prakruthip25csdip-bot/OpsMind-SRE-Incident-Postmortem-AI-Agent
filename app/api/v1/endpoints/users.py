"""User management endpoints."""

from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db, require_roles
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
async def list_users(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_roles(["admin"]))],
    skip: int = 0,
    limit: int = 50
):
    """List all registered users (Admin only)."""
    repo = UserRepository(db)
    return await repo.list_users(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Retrieve details for a specific user."""
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    return user

