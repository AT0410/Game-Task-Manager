from fastapi import APIRouter, Depends
from backend.models import User
from backend.utils.users import get_current_user_id
from backend.database import task_db

router = APIRouter(
    tags=["users"]
)

# @router.get("/user", response_model=User)
# async def user(current_user: User = Depends(get_current_active_user)):
#     return current_user

@router.get("/userid", response_model=int)
async def user(current_user_id: int = Depends(get_current_user_id)):
    return current_user_id

@router.get("/user/tasks")
async def get_user_tasks(current_user_id: int = Depends(get_current_user_id)):
    return task_db.get_tasks(current_user_id)