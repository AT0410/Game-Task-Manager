from fastapi import APIRouter, Depends
from backend.models import User, TaskCreate, TaskUpdate
from backend.utils.users import get_current_user_id
from backend.database import task_db, user_db

router = APIRouter(
    tags=["users"]
)

@router.get("/user", response_model=User)
async def user(current_user_id: int = Depends(get_current_user_id)):
    return user_db.get_user(current_user_id)

@router.get("/userid", response_model=int)
async def user(current_user_id: int = Depends(get_current_user_id)):
    return current_user_id

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