"""Conversation service for managing chat sessions and message history."""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.hindsight_engine import hindsight_engine
from app.core.exceptions import EntityNotFoundError
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
from app.repositories.conversation_repo import ConversationRepository
from app.schemas.conversation import ConversationCreate


class ConversationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ConversationRepository(db)

    async def create_conversation(self, conv_in: ConversationCreate, user: User) -> Conversation:
        bank_id = hindsight_engine.build_bank_id(user.team_id, conv_in.service_name)
        conv = Conversation(
            title=conv_in.title,
            incident_id=conv_in.incident_id,
            user_id=user.id,
            service_name=conv_in.service_name,
            hindsight_bank_id=bank_id
        )
        return await self.repo.create(conv)

    async def get_conversation(self, conversation_id: str, load_messages: bool = True) -> Conversation:
        conv = await self.repo.get_by_id(conversation_id, load_messages=load_messages)
        if not conv:
            raise EntityNotFoundError(f"Conversation with ID '{conversation_id}' not found.")
        return conv

    async def list_conversations(self, user_id: str, skip: int = 0, limit: int = 50) -> List[Conversation]:
        return await self.repo.list_by_user(user_id=user_id, skip=skip, limit=limit)

    async def list_messages(self, conversation_id: str, limit: int = 100) -> List[Message]:
        await self.get_conversation(conversation_id, load_messages=False)
        return await self.repo.list_messages(conversation_id, limit=limit)

