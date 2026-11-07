"""User database model."""

from typing import List, Optional
from sqlalchemy import Boolean, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="engineer", nullable=False)  # admin, engineer, viewer
    team_id: Mapped[str] = mapped_column(String(100), default="sre-core", nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    incidents = relationship("Incident", back_populates="created_by", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    runbook_actions = relationship("RunbookAction", back_populates="executed_by")
    feedbacks = relationship("AgentFeedback", back_populates="user")

    __table_args__ = (
        Index("ix_users_team_role", "team_id", "role"),
    )

