"""Message model storing conversation interactions, recalled Hindsight memories, and model telemetry."""

from typing import Optional
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender: Mapped[str] = mapped_column(String(20), nullable=False)  # user, agent, system
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Persistent Memory telemetry captured during this interaction
    memories_recalled: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON serialized list of recalled memory units
    reflection_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Synthesized reflection from Hindsight
    model_used: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    feedbacks = relationship("AgentFeedback", back_populates="message", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_messages_conv_created", "conversation_id", "created_at"),
    )

