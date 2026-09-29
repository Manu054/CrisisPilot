from typing import Optional, Any, Dict
from fastapi import HTTPException, status


class AppException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_SERVER_ERROR",
        message: str = "An unexpected error occurred.",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "error": {
                    "code": code,
                    "message": message,
                    "details": details or {}
                }
            }
        )
        self.code = code
        self.message = message
        self.details = details or {}


class AuthenticationError(AppException):
    def __init__(self, message: str = "Invalid credentials or token expired."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="AUTHENTICATION_FAILED",
            message=message
        )


class PermissionDeniedError(AppException):
    def __init__(self, message: str = "You do not have permission to access this resource."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="PERMISSION_DENIED",
            message=message
        )


class OrganizationMismatchError(AppException):
    def __init__(self, message: str = "Resource does not belong to your organization."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="ORGANIZATION_MISMATCH",
            message=message
        )


class NotFoundError(AppException):
    def __init__(self, resource: str = "Resource", identifier: Optional[str] = None):
        msg = f"{resource} not found." if not identifier else f"{resource} with id '{identifier}' was not found."
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code=f"{resource.upper().replace(' ', '_')}_NOT_FOUND",
            message=msg
        )


class CrisisNotFoundError(NotFoundError):
    def __init__(self, identifier: Optional[str] = None):
        super().__init__(resource="Crisis", identifier=identifier)


class HindSightError(AppException):
    def __init__(self, message: str = "HindSight memory service error.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="HINDSIGHT_SERVICE_ERROR",
            message=message,
            details=details
        )


class LLMProviderError(AppException):
    def __init__(self, message: str = "LLM provider error.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            code="LLM_PROVIDER_ERROR",
            message=message,
            details=details
        )


class SimulationCalculationError(AppException):
    def __init__(self, message: str = "Mathematical simulation calculation error.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="SIMULATION_CALCULATION_ERROR",
            message=message,
            details=details
        )
