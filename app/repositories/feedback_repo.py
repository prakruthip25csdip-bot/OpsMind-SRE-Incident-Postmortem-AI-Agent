"""Feedback and Audit log repositories."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.feedback import AgentFeedback
from app.models.audit_log import AuditLog


class FeedbackRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, feedback: AgentFeedback) -> AgentFeedback:
        self.db.add(feedback)
        await self.db.flush()
        await self.db.refresh(feedback)
        return feedback

    async def list_by_message(self, message_id: str) -> List[AgentFeedback]:
        result = await self.db.execute(select(AgentFeedback).where(AgentFeedback.message_id == message_id))
        return list(result.scalars().all())


class AuditRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log(
        self,
        action: str,
        entity_type: str,
        user_id: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        audit = AuditLog(
            action=action,
            entity_type=entity_type,
            user_id=user_id,
            entity_id=entity_id,
            details=details,
            ip_address=ip_address
        )
        self.db.add(audit)
        await self.db.flush()
        return audit

