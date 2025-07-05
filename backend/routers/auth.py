from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from backend.models import Token, UserRegister
from backend.utils.security import authenticate_user, create_access_token, get_password_hash
from ..database import user_db

import os
from dotenv import load_dotenv 

load_dotenv()

router = APIRouter(tags=["auth"])

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_id = authenticate_user(form_data.username, form_data.password)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(
        data={"sub": str(user_id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
def register_user(user: UserRegister):
    db_user = user_db.get_user(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered.")
    hashed_password = get_password_hash(user.password)
    user_db.create_user(
        full_name=user.fullname,
        email=user.email,
        hashed_password=hashed_password
    )