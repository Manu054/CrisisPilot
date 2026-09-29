import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr


from pydantic import BaseModel, ConfigDict, model_validator


class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

    @model_validator(mode="after")
    def check_identifier(self):
        if not self.email and not self.username:
            raise ValueError("Either email or username is required.")
        if not self.email and self.username:
            self.email = self.username
        return self


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    organization_name: str
    industry: Optional[str] = "Consumer Goods & Electronics"
    currency: Optional[str] = "INR"
    role: Optional[str] = "admin"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    email: str
    role: str


class TokenPayload(BaseModel):
    sub: str
    org_id: str
    role: str
    exp: int


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    email: str
    role: str
