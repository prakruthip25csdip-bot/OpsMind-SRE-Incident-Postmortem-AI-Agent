"""Authentication API endpoints."""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Register a new SRE/DevOps engineer or administrator."""
    service = AuthService(db)
    user = await service.register(user_in)
    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Authenticate with email and password to receive a JWT access token."""
    service = AuthService(db)
    _, token = await service.authenticate(credentials)
    return token


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Retrieve profile of currently authenticated user."""
    return current_user

