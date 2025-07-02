from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    
class User(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None
    disabled: bool | None = None
    
class UserInDB(User):
    id: int
    hashed_password: str
    
class UserRegister(BaseModel):
    username: str
    fullname: str
    email: str
    password: str
    