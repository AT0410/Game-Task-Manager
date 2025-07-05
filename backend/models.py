from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int | None = None
    
class User(BaseModel):
    full_name: str | None = None
    email: str | None = None
    disabled: bool | None = None
    
class UserInDB(User):
    id: int
    hashed_password: str
    
class UserRegister(BaseModel):
    fullname: str
    email: str
    password: str

class UserVerification(BaseModel):
    id: int
    hashed_password: str    