from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from backend.database import user_db

import os
from dotenv import load_dotenv 

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_pw: str, hashed_pw: str) -> bool:
    return pwd_context.verify(plain_pw, hashed_pw)

def get_password_hash(pw: str) -> str:
    return pwd_context.hash(pw)


def authenticate_user(email: str, pw: str):
    """
    Returns user id 
    """
    user = user_db.get_user_verification(email)
    if not user:
        return False
    if not verify_password(pw, user.hashed_password):
        return False
    return user.id

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expires_time = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expires_time})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt 
