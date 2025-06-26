from fastapi import FastAPI
from backend.routers import auth, users

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)


