"""Seed script to populate initial SRE users, incidents, and Hindsight memories."""

import asyncio
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models.incident import Incident
from app.models.runbook import RunbookAction
from app.models.user import User
from app.ai.hindsight_engine import hindsight_engine


async def seed():
    print("Starting database schema migration & data seed...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select
        res = await db.execute(select(User).where(User.email == "lead.sre@opsmind.io"))
        existing_user = res.scalar_one_or_none()

        if existing_user:
            print("Database already contains seed user. Skipping user creation.")
            user = existing_user
        else:
            print("Creating default demo users...")
            user = User(
                email="lead.sre@opsmind.io",
                hashed_password=hash_password("DemoPassword123!"),
                full_name="Lead SRE Engineer",
                role="admin",
                team_id="sre-core",
                is_active=True
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            print(f"User created: {user.email} (Password: DemoPassword123!)")

        # Create Historical Sample Incidents
        bank_id = hindsight_engine.build_bank_id(user.team_id, "checkout-service")

        res = await db.execute(select(Incident).where(Incident.title == "PostgreSQL Connection Exhaustion Cascade"))
        if not res.scalar_one_or_none():
            print("Seeding resolved incident and Hindsight postmortem...")
            inc = Incident(
                title="PostgreSQL Connection Exhaustion Cascade",
                description="Checkout service latency surged from 45ms to 12.4s. 504 Gateway timeouts for 22 minutes.",
                severity="P1",
                status="resolved",
                service_name="checkout-service",
                environment="production",
                error_logs="FATAL: remaining connection slots are reserved for non-replication superuser connections",
                root_cause="New Kubernetes horizontal pod autoscaler scaled pods to 50 without increasing PgBouncer max client connections.",
                mitigation_steps="Increased PgBouncer default_pool_size from 25 to 120 and capped HPA max replicas at 24.",
                time_to_mitigate_mins=22,
                hindsight_bank_id=bank_id,
                created_by_id=user.id
            )
            db.add(inc)
            await db.commit()
            await db.refresh(inc)

            # Add runbook steps
            rb = RunbookAction(
                incident_id=inc.id,
                step_name="Scale PgBouncer pool",
                command_or_action="kubectl patch configmap pgbouncer-config -p '{\"data\":{\"default_pool_size\":\"120\"}}'",
                execution_result="success",
                engineer_notes="Applied dynamically without dropping active client connections.",
                executed_by_id=user.id
            )
            db.add(rb)
            await db.commit()

            # Seed into Hindsight
            print(f"Retaining postmortem to Hindsight bank '{bank_id}'...")
            await hindsight_engine.aretain(
                bank_id=bank_id,
                content="""[HISTORICAL POSTMORTEM - CHECKOUT SERVICE]
Incident: PostgreSQL Connection Exhaustion Cascade
Root Cause: HPA scaled worker pods to 50, exceeding PgBouncer max pool of 25.
Mitigation: Set PgBouncer default_pool_size=120 and capped HPA at 24 replicas.
Warning: Never increase HPA max_replicas without checking downstream database pool limits!
""",
                tags=["checkout-service", "P1", "postmortem", "pgbouncer", "database"]
            )
            print("Hindsight memory retention attempted.")

    print("\n Seed completed successfully!")
    print("Demo Credentials:")
    print("Email:    lead.sre@opsmind.io")
    print("Password: DemoPassword123!")


if __name__ == "__main__":
    asyncio.run(seed())

