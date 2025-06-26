from backend.models import UserInDB

db = {
    "alvin" : {
        "username": "alvin",
        "full_name": "Alvin Tang",
        "email": "alvin@gmail.com",
        "hashed_password": "$2b$12$RevcRMN8NdOl6R101iERheNqSV7XLCaI2YgzJ3x/YSB4YdW7AZLgq",
        "disabled": False
    }
}

def get_user(username: str):
    if username in db:
        data = db[username]
        return UserInDB(**data)