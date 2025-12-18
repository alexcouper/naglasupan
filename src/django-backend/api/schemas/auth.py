from ninja import Schema


class Token(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(Schema):
    email: str
    password: str
