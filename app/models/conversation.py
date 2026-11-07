"""Conversation session model linking user, incident context, and Hindsight memory bank."""

from typing import List, Optional
from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class Conversation(Base, TimestampMixin):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    incident_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    service_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    hindsight_bank_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="conversations")
    incident = relationship("Incident", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")

    __table_args__ = (
        Index("ix_conversations_user_service", "user_id", "service_name"),
    )

