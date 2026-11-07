"""Feedback endpoints to capture engineer ratings and reinforce memory quality."""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_in: FeedbackCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Submit quality rating on an OpsMind response to close the continuous learning loop."""
    service = FeedbackService(db)
    return await service.submit_feedback(feedback_in, current_user)

