"""Runbook execution actions model to track steps taken during an incident."""

from typing import Optional
from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class RunbookAction(Base, TimestampMixin):
    __tablename__ = "runbook_actions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    step_name: Mapped[str] = mapped_column(String(255), nullable=False)
    command_or_action: Mapped[str] = mapped_column(Text, nullable=False)
    execution_result: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)  # pending, success, failure, rolled_back
    engineer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    executed_by_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    incident = relationship("Incident", back_populates="runbook_actions")
    executed_by = relationship("User", back_populates="runbook_actions")

    __table_args__ = (
        Index("ix_runbook_incident_result", "incident_id", "execution_result"),
    )

