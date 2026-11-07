"""Pydantic schemas for authentication tokens."""

from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    team_id: Optional[str] = None

