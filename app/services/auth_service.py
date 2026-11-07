"""Authentication service handling registration, password verification, and JWTs."""

from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AuthenticationError, ConflictError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserLogin


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, user_in: UserCreate) -> User:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise ConflictError(f"A user with email '{user_in.email}' already exists.")

        user = User(
            email=user_in.email.lower(),
            hashed_password=hash_password(user_in.password),
            full_name=user_in.full_name,
            role=user_in.role,
            team_id=user_in.team_id,
            is_active=True
        )
        return await self.user_repo.create(user)

    async def authenticate(self, credentials: UserLogin) -> Tuple[User, Token]:
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password.")
        if not user.is_active:
            raise AuthenticationError("User account is inactive.")

        token = create_access_token(
            subject=user.id,
            claims={"role": user.role, "team_id": user.team_id}
        )
        token_data = Token(
            access_token=token,
            token_type="bearer",
            expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        return user, token_data

