"""Incident database model for SRE telemetry and postmortems."""

from typing import List, Optional
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, generate_uuid


class Incident(Base, TimestampMixin):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(10), default="P2", nullable=False, index=True)  # P1, P2, P3, P4
    status: Mapped[str] = mapped_column(String(30), default="open", nullable=False, index=True)  # open, investigating, mitigated, resolved
    service_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    environment: Mapped[str] = mapped_column(String(50), default="production", nullable=False)
    error_logs: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    root_cause: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mitigation_steps: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    time_to_mitigate_mins: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    hindsight_bank_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    created_by_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    created_by = relationship("User", back_populates="incidents")
    conversations = relationship("Conversation", back_populates="incident", cascade="all, delete-orphan")
    runbook_actions = relationship("RunbookAction", back_populates="incident", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_incidents_service_status", "service_name", "status"),
        Index("ix_incidents_severity_status", "severity", "status"),
    )

