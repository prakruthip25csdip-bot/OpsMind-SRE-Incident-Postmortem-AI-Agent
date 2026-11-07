"""Feedback service to capture ratings and refine Hindsight memory quality."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.hindsight_engine import hindsight_engine
from app.core.exceptions import EntityNotFoundError
from app.models.feedback import AgentFeedback
from app.models.user import User
from app.repositories.conversation_repo import ConversationRepository
from app.repositories.feedback_repo import FeedbackRepository
from app.schemas.feedback import FeedbackCreate


class FeedbackService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.feedback_repo = FeedbackRepository(db)
        self.conv_repo = ConversationRepository(db)

    async def submit_feedback(self, feedback_in: FeedbackCreate, user: User) -> AgentFeedback:
        message = await self.conv_repo.get_message_by_id(feedback_in.message_id)
        if not message:
            raise EntityNotFoundError(f"Message with ID '{feedback_in.message_id}' not found.")

        feedback = AgentFeedback(
            message_id=feedback_in.message_id,
            user_id=user.id,
            rating=feedback_in.rating,
            feedback_type=feedback_in.feedback_type,
            comments=feedback_in.comments
        )
        saved = await self.feedback_repo.create(feedback)

        # If feedback indicates high satisfaction on a resolution, retain positive reinforcement
        if feedback_in.rating >= 4 and feedback_in.comments:
            conversation = await self.conv_repo.get_by_id(message.conversation_id)
            if conversation:
                await hindsight_engine.aretain(
                    bank_id=conversation.hindsight_bank_id,
                    content=f"[USER VALIDATED RESOLUTION (Rating {feedback_in.rating}/5)]\nContext: {message.content[:300]}\nUser Comments: {feedback_in.comments}",
                    tags=["user-feedback", "validated", conversation.service_name]
                )

        return saved

