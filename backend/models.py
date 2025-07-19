from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int | None = None
    
class User(BaseModel):
    id: int
    full_name: str = ""
    email: str
    
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

class TaskCreate(BaseModel):
    title: str
    due_date: datetime
    completed: bool
    
class TaskUpdate(BaseModel):
    id: int
    title: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    description: Optional[str] = None
    category: Optional[str] = None
    