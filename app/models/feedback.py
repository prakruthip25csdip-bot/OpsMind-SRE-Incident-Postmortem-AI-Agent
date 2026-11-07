"""Feedback database model for tracking AI response quality and user learning loops."""

from typing import Optional
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class AgentFeedback(Base, TimestampMixin):
    __tablename__ = "agent_feedback"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    message_id: Mapped[str] = mapped_column(String(36), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1 to 5 scale
    feedback_type: Mapped[str] = mapped_column(String(50), default="accuracy", nullable=False)  # helpful, irrelevant_memory, incorrect_diagnosis, resolved_incident
    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    message = relationship("Message", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")

    __table_args__ = (
        Index("ix_feedback_message_rating", "message_id", "rating"),
    )

