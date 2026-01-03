from ninja import Schema


class Token(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"  # noqa: S105


class AccessToken(Schema):
    access_token: str
    token_type: str = "bearer"  # noqa: S105


class LoginRequest(Schema):
    email: str
    password: str


class RefreshRequest(Schema):
    refresh_token: str
