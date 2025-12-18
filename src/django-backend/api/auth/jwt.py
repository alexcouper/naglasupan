import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from typing import Optional, Dict, Any


User = get_user_model()


def create_access_token(user_id: str) -> str:
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_from_token(token: str) -> Optional[User]:
    payload = verify_token(token)
    if not payload:
        return None
    
    try:
        user = User.objects.get(id=payload['user_id'])
        return user if user.is_active else None
    except User.DoesNotExist:
        return None