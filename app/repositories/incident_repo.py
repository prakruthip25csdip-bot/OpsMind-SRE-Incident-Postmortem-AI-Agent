"""Incident repository for querying and managing SRE incidents."""

from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident
from app.models.runbook import RunbookAction


class IncidentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, incident_id: str) -> Optional[Incident]:
        result = await self.db.execute(select(Incident).where(Incident.id == incident_id))
        return result.scalar_one_or_none()

    async def list_incidents(
        self,
        service_name: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Incident], int]:
        query = select(Incident)
        count_query = select(func.count(Incident.id))

        if service_name:
            query = query.where(Incident.service_name == service_name)
            count_query = count_query.where(Incident.service_name == service_name)
        if severity:
            query = query.where(Incident.severity == severity)
            count_query = count_query.where(Incident.severity == severity)
        if status:
            query = query.where(Incident.status == status)
            count_query = count_query.where(Incident.status == status)

        total_count_res = await self.db.execute(count_query)
        total = total_count_res.scalar_one()

        query = query.order_by(Incident.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def create(self, incident: Incident) -> Incident:
        self.db.add(incident)
        await self.db.flush()
        await self.db.refresh(incident)
        return incident

    async def update(self, incident: Incident) -> Incident:
        await self.db.flush()
        await self.db.refresh(incident)
        return incident

    async def delete(self, incident: Incident) -> None:
        await self.db.delete(incident)
        await self.db.flush()

    # Runbook actions
    async def add_runbook_action(self, action: RunbookAction) -> RunbookAction:
        self.db.add(action)
        await self.db.flush()
        await self.db.refresh(action)
        return action

    async def get_runbook_actions(self, incident_id: str) -> List[RunbookAction]:
        result = await self.db.execute(
            select(RunbookAction)
            .where(RunbookAction.incident_id == incident_id)
            .order_by(RunbookAction.created_at.asc())
        )
        return list(result.scalars().all())

