from ninja import Schema
from typing import Optional


class Token(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(Schema):
    username: str
    password: str