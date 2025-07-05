from fastapi import APIRouter, Depends
from backend.models import User
from backend.utils.users import get_current_user_id

router = APIRouter(tags=["users"])

# @router.get("/user", response_model=User)
# async def user(current_user: User = Depends(get_current_active_user)):
#     return current_user

@router.get("/userid", response_model=int)
async def user(current_user_id: int = Depends(get_current_user_id)):
    return current_user_id

# @router.get("/user/items")
# async def read_own_items(current_user: User = Depends(get_current_active_user)):
#     return [{"item_id": 1, "owner": current_user}]