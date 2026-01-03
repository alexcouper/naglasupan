from __future__ import annotations

from typing import TYPE_CHECKING, Any

from django.contrib.auth import authenticate, get_user_model
from django.http import HttpRequest
from ninja import Router

from api.auth.jwt import create_access_token, create_refresh_token, verify_token
from api.auth.security import auth
from api.schemas.auth import AccessToken, LoginRequest, RefreshRequest, Token
from api.schemas.errors import Error
from api.schemas.user import UserCreate, UserResponse, UserUpdate

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()
router = Router()


@router.post(
    "/register",
    response={201: UserResponse, 400: Error},
    tags=["Authentication"],
)
def register(
    request: HttpRequest,
    payload: UserCreate,
) -> tuple[int, AbstractUser | Error]:
    # Check if user already exists
    if User.objects.filter(email=payload.email).exists():
        return 400, Error(detail="Email already registered")

    if User.objects.filter(kennitala=payload.kennitala).exists():
        return 400, Error(detail="Kennitala already registered")

    # Create user
    user = User.objects.create_user(
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        kennitala=payload.kennitala,
    )

    return 201, user


@router.post("/login", response={200: Token, 401: Error}, tags=["Authentication"])
def login(
    request: HttpRequest,
    payload: LoginRequest,
) -> dict[str, Any] | tuple[int, dict[str, str]]:
    user = authenticate(request, username=payload.email, password=payload.password)

    if not user:
        return 401, {"detail": "Invalid credentials"}

    if not user.is_active:
        return 401, {"detail": "Account is inactive"}

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post(
    "/refresh",
    response={200: AccessToken, 401: Error},
    tags=["Authentication"],
)
def refresh_token_endpoint(
    request: HttpRequest,
    payload: RefreshRequest,
) -> dict[str, str] | tuple[int, dict[str, str]]:
    token_payload = verify_token(payload.refresh_token)

    if not token_payload:
        return 401, {"detail": "Invalid or expired refresh token"}

    if token_payload.get("type") != "refresh":
        return 401, {"detail": "Invalid token type"}

    try:
        user = User.objects.get(id=token_payload["user_id"])
    except User.DoesNotExist:
        return 401, {"detail": "User not found"}

    if not user.is_active:
        return 401, {"detail": "Account is inactive"}

    access_token = create_access_token(user.id)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/me",
    response={200: UserResponse, 401: Error},
    auth=auth,
    tags=["Authentication"],
)
def get_current_user_info(request: HttpRequest) -> AbstractUser:
    return request.auth


@router.put(
    "/me",
    response={200: UserResponse, 400: Error, 401: Error},
    auth=auth,
    tags=["Authentication"],
)
def update_current_user(
    request: HttpRequest,
    payload: UserUpdate,
) -> AbstractUser:
    user = request.auth

    # Update only provided fields
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(user, field, value)

    user.save()
    return user
