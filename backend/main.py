from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, users

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)

origins = [
    "http://localhost:5173" # frontend url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)   
