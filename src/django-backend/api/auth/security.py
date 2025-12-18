from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from .jwt import get_user_from_token


User = get_user_model()


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        user = get_user_from_token(token)
        if user:
            return user
        return None


# Instance to use in endpoints
auth = JWTAuth()


def require_admin(user):
    """Check if user is admin/superuser"""
    return user and user.is_superuser