from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from ninja import Router
from passlib.hash import bcrypt

from api.auth.jwt import create_access_token, create_refresh_token
from api.auth.security import auth
from api.schemas.auth import LoginRequest, Token
from api.schemas.errors import Error
from api.schemas.user import UserCreate, UserResponse, UserUpdate

User = get_user_model()
router = Router()


@router.post("/register", response={201: UserResponse, 400: Error}, tags=["Authentication"])
def register(request, payload: UserCreate):
    # Check if user already exists
    if User.objects.filter(email=payload.email).exists():
        return 400, Error(detail="Email already registered")

    if User.objects.filter(username=payload.username).exists():
        return 400, Error(detail="Username already taken")

    if User.objects.filter(kennitala=payload.kennitala).exists():
        return 400, Error(detail="Kennitala already registered")

    # Create user
    user = User.objects.create_user(
        email=payload.email,
        username=payload.username,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        kennitala=payload.kennitala,
    )

    return 201, user


@router.post("/login", response={200: Token, 401: Error}, tags=["Authentication"])
def login(request, payload: LoginRequest):
    # Try to authenticate with email or username
    user = None
    if "@" in payload.username:
        # Login with email - use email directly since USERNAME_FIELD = 'email'
        user = authenticate(request, username=payload.username, password=payload.password)
    else:
        # Login with username - need to get the email first
        try:
            user_obj = User.objects.get(username=payload.username)
            user = authenticate(request, username=user_obj.email, password=payload.password)
        except User.DoesNotExist:
            pass

    if not user:
        return 401, {"detail": "Invalid credentials"}

    if not user.is_active:
        return 401, {"detail": "Account is inactive"}

    # Check if user is verified (optional - uncomment if verification is required)
    # if not user.is_verified:
    #     return 401, {"detail": "Account is not verified"}

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response={200: UserResponse, 401: Error}, auth=auth, tags=["Authentication"])
def get_current_user_info(request):
    return request.auth


@router.put("/me", response={200: UserResponse, 400: Error, 401: Error}, auth=auth, tags=["Authentication"])
def update_current_user(request, payload: UserUpdate):
    user = request.auth

    # Update only provided fields
    for field, value in payload.dict(exclude_unset=True).items():
        if field == 'username' and User.objects.filter(username=value).exclude(id=user.id).exists():
            return 400, {"detail": "Username already taken"}
        setattr(user, field, value)

    user.save()
    return user