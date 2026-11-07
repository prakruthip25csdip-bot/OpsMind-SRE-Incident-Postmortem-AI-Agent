"""Application-wide custom exception definitions."""

from typing import Any, Optional


class AppException(Exception):
    """Base application exception."""
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details


class AuthenticationError(AppException):
    def __init__(self, message: str = "Authentication failed", details: Optional[Any] = None):
        super().__init__(message, status_code=401, error_code="AUTHENTICATION_ERROR", details=details)


class PermissionDeniedError(AppException):
    def __init__(self, message: str = "Permission denied", details: Optional[Any] = None):
        super().__init__(message, status_code=403, error_code="PERMISSION_DENIED", details=details)


class EntityNotFoundError(AppException):
    def __init__(self, message: str = "Entity not found", details: Optional[Any] = None):
        super().__init__(message, status_code=404, error_code="ENTITY_NOT_FOUND", details=details)


class ConflictError(AppException):
    def __init__(self, message: str = "Resource conflict", details: Optional[Any] = None):
        super().__init__(message, status_code=409, error_code="CONFLICT_ERROR", details=details)


class ValidationError(AppException):
    def __init__(self, message: str = "Validation failed", details: Optional[Any] = None):
        super().__init__(message, status_code=422, error_code="VALIDATION_ERROR", details=details)


class HindsightServiceError(AppException):
    def __init__(self, message: str = "Hindsight memory service failure", details: Optional[Any] = None):
        super().__init__(message, status_code=502, error_code="HINDSIGHT_SERVICE_ERROR", details=details)


class LLMServiceError(AppException):
    def __init__(self, message: str = "LLM inference failure", details: Optional[Any] = None):
        super().__init__(message, status_code=502, error_code="LLM_SERVICE_ERROR", details=details)

