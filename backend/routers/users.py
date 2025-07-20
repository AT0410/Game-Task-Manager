from fastapi import APIRouter, Depends, HTTPException
from backend.models import User, TaskCreate, TaskUpdate, ProfileUpdate, PasswordUpdate
from backend.utils.users import get_current_user_id
from backend.utils.security import verify_password, get_password_hash
from backend.database import task_db, user_db

router = APIRouter(
    tags=["users"]
)

@router.get("/user", response_model=User)
async def user(current_user_id: int = Depends(get_current_user_id)):
    return user_db.get_user(current_user_id)

@router.get("/userid", response_model=int)
async def userid(current_user_id: int = Depends(get_current_user_id)):
    return current_user_id

@router.delete("/user/delete")
async def userid(current_user_id: int = Depends(get_current_user_id)):
    return user_db.delete_user(current_user_id)

@router.patch("/user/updateprofile")
async def user_update_profile(profileData: ProfileUpdate, current_user_id: int = Depends(get_current_user_id)):
    return user_db.update(current_user_id, profileData)

@router.patch("/user/updatepassword")
async def user_update_password(passwordData: PasswordUpdate, current_user_id: int = Depends(get_current_user_id)):
    hashed_pw = user_db.get_user_password(current_user_id)
    if not verify_password(passwordData.current, hashed_pw):
        raise HTTPException(status_code=401, detail="Incorrect current password")
    new_hash = get_password_hash(passwordData.new)
    user_db.update_password(current_user_id, new_hash)

@router.get("/user/tasks")
async def get_user_tasks(current_user_id: int = Depends(get_current_user_id)):
    return task_db.get_tasks(current_user_id)

@router.post("/user/addtask")
async def add_user_task(task: TaskCreate, current_user_id: int =  Depends(get_current_user_id)):
    return task_db.add_task(user_id=current_user_id, title=task.title, due_date=task.due_date, 
                     completed=task.completed)

@router.delete("/user/deletetask/{task_id}")
async def delete_user_task(task_id: int, current_user_id: int = Depends(get_current_user_id)):
    task_db.delete_task(task_id, current_user_id)
    
@router.patch("/user/updatetask")
async def delete_user_task(taskData: TaskUpdate, current_user_id: int = Depends(get_current_user_id)):
    task_db.update_task(taskData, current_user_id)