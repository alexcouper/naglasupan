from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from ninja.security import HttpBearer

from .jwt import get_user_from_token

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()


class JWTAuth(HttpBearer):
    def authenticate(
        self,
        request: HttpRequest,
        token: str,
    ) -> "AbstractUser | None":
        user = get_user_from_token(token)
        if user:
            return user
        return None


class OptionalJWTAuth(HttpBearer):
    """JWT auth that allows anonymous access - returns None for unauthenticated."""

    def __call__(self, request: HttpRequest) -> "AbstractUser | None":
        # Check if Authorization header exists
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            return self.authenticate(request, token)
        # No auth header - return None (anonymous user)
        return None

    def authenticate(
        self,
        request: HttpRequest,
        token: str,
    ) -> "AbstractUser | None":
        user = get_user_from_token(token)
        if user:
            return user
        return None


# Instance to use in endpoints
auth = JWTAuth()
optional_auth = OptionalJWTAuth()


def require_admin(user: "AbstractUser | None") -> bool:
    """Check if user is admin/superuser."""
    return bool(user and user.is_superuser)
