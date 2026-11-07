"""Incident management service implementing Hindsight memory retention on resolution."""

from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.hindsight_engine import hindsight_engine
from app.ai.prompt_templates import INCIDENT_MEMORY_RETAIN_TEMPLATE
from app.core.exceptions import EntityNotFoundError
from app.models.incident import Incident
from app.models.runbook import RunbookAction
from app.models.user import User
from app.repositories.incident_repo import IncidentRepository
from app.schemas.incident import IncidentCreate, IncidentResolve, IncidentUpdate
from app.schemas.runbook import RunbookActionCreate


class IncidentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = IncidentRepository(db)

    async def create_incident(self, incident_in: IncidentCreate, user: User) -> Incident:
        bank_id = hindsight_engine.build_bank_id(user.team_id, incident_in.service_name)
        incident = Incident(
            title=incident_in.title,
            description=incident_in.description,
            severity=incident_in.severity,
            status="open",
            service_name=incident_in.service_name,
            environment=incident_in.environment,
            error_logs=incident_in.error_logs,
            hindsight_bank_id=bank_id,
            created_by_id=user.id
        )
        return await self.repo.create(incident)

    async def get_incident(self, incident_id: str) -> Incident:
        incident = await self.repo.get_by_id(incident_id)
        if not incident:
            raise EntityNotFoundError(f"Incident with ID '{incident_id}' not found.")
        return incident

    async def list_incidents(
        self,
        service_name: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Incident], int]:
        return await self.repo.list_incidents(
            service_name=service_name,
            severity=severity,
            status=status,
            skip=skip,
            limit=limit
        )

    async def update_incident(self, incident_id: str, incident_update: IncidentUpdate) -> Incident:
        incident = await self.get_incident(incident_id)
        update_data = incident_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(incident, field, value)
        return await self.repo.update(incident)

    async def resolve_incident(self, incident_id: str, resolve_in: IncidentResolve, user: User) -> Incident:
        """Resolve an incident and retain the verified postmortem into Hindsight."""
        incident = await self.get_incident(incident_id)
        incident.status = "resolved"
        incident.root_cause = resolve_in.root_cause
        incident.mitigation_steps = resolve_in.mitigation_steps
        incident.time_to_mitigate_mins = resolve_in.time_to_mitigate_mins

        updated = await self.repo.update(incident)

        # Retain resolution memory into Hindsight
        if resolve_in.retain_to_hindsight:
            memory_text = INCIDENT_MEMORY_RETAIN_TEMPLATE.format(
                service_name=incident.service_name,
                severity=incident.severity,
                title=incident.title,
                error_summary=incident.error_logs[:300] if incident.error_logs else incident.description[:300],
                root_cause=resolve_in.root_cause,
                mitigation_steps=resolve_in.mitigation_steps,
                time_to_mitigate_mins=resolve_in.time_to_mitigate_mins or 0,
                runbook_notes=f"Resolved by {user.full_name} ({user.email})"
            )
            await hindsight_engine.aretain(
                bank_id=incident.hindsight_bank_id,
                content=memory_text,
                tags=[incident.service_name, incident.severity, "resolution", "postmortem"],
                metadata={
                    "incident_id": incident.id,
                    "service": incident.service_name,
                    "resolver_id": user.id
                }
            )

        return updated

    async def add_runbook_action(
        self,
        incident_id: str,
        action_in: RunbookActionCreate,
        user: User
    ) -> RunbookAction:
        await self.get_incident(incident_id)
        action = RunbookAction(
            incident_id=incident_id,
            step_name=action_in.step_name,
            command_or_action=action_in.command_or_action,
            execution_result=action_in.execution_result,
            engineer_notes=action_in.engineer_notes,
            executed_by_id=user.id
        )
        return await self.repo.add_runbook_action(action)

    async def get_runbook_actions(self, incident_id: str) -> List[RunbookAction]:
        return await self.repo.get_runbook_actions(incident_id)

