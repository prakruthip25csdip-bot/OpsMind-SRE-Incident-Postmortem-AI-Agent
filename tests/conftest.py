"""Pytest test configuration and fixtures."""

import asyncio
from typing import AsyncGenerator
from unittest.mock import AsyncMock, patch
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_db
from app.core.config import settings
from app.core.security import create_access_token, hash_password
from app.db.base import Base
from app.main import app
from app.models.user import User
from app.ai.hindsight_engine import hindsight_engine
from app.ai.agent_engine import agent_engine
from app.ai.llm_client import llm_client

# Ensure tests run with local simulated SRE LLM engine
settings.GROQ_API_KEY = ""
llm_client.api_key = ""

# Use in-memory SQLite for hermetic, ultra-fast test runs
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


@pytest.fixture(autouse=True)
def mock_hindsight_calls(monkeypatch):
    """
    Test double for Hindsight memory calls during automated test execution.
    Complies with Rule 11: uses isolated test doubles when live Hindsight daemon is offline.
    """
    async def mock_aretain(bank_id, content, context=None, tags=None, metadata=None):
        return {
            "success": True,
            "bank_id": bank_id,
            "items_count": 1,
            "operation_id": "op_test_mock_123"
        }

    async def mock_arecall(bank_id, query, max_tokens=4096, tags=None):
        return {
            "bank_id": bank_id,
            "query": query,
            "total_memories": 1,
            "memories": [{
                "text": "Incident P1: PgBouncer pool exhaustion resolved by scaling pool to 120.",
                "similarity": 0.92,
                "tags": ["database", "p1"]
            }],
            "formatted_prompt": "[MEMORY 1] Incident P1: PgBouncer pool exhaustion resolved by scaling pool to 120."
        }

    async def mock_areflect(bank_id, query, budget="low", context=None):
        return {
            "bank_id": bank_id,
            "query": query,
            "reflection": "Past postmortems show that scaling pods without adjusting database pool triggers 504 cascades.",
            "based_on_count": 1,
            "based_on": ["Incident P1-Postgres"]
        }

    for target in [hindsight_engine, agent_engine.memory_engine]:
        monkeypatch.setattr(target, "aretain", mock_aretain)
        monkeypatch.setattr(target, "arecall", mock_arecall)
        monkeypatch.setattr(target, "areflect", mock_areflect)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide a clean database session for each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestAsyncSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """HTTP client wired to test database session."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def test_user(db_session: AsyncSession) -> User:
    """Create and return a sample test user in the test database."""
    user = User(
        email="sre.engineer@opsmind.io",
        hashed_password=hash_password("SuperSecret123!"),
        full_name="Lead SRE Engineer",
        role="engineer",
        team_id="sre-core",
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture(scope="function")
async def auth_headers(test_user: User) -> dict:
    """Generate Authorization Bearer headers for the test user."""
    token = create_access_token(
        subject=test_user.id,
        claims={"role": test_user.role, "team_id": test_user.team_id}
    )
    return {"Authorization": f"Bearer {token}"}
