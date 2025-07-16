from backend.models import UserInDB, UserVerification
from psycopg2 import pool
from contextlib import contextmanager
from typing import Optional
import datetime

CONN_POOL = pool.SimpleConnectionPool(
    1, 20, host="localhost", dbname="postgres", user="postgres", password="b1uesH33p#", port="5432"
)

@contextmanager
def get_conn():
    conn = CONN_POOL.getconn()
    try:
        yield conn
        conn.commit()
    except:
        conn.rollback()
        raise Exception("Database operation failed")
    finally:
        CONN_POOL.putconn(conn)


def fetch_query(query: str, params: tuple = ()):
    with get_conn() as conn, conn.cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchall()
    
def execute_query(query: str, params: tuple = ()):
   with get_conn() as conn, conn.cursor() as cursor:
        cursor.execute(query, params)


class UserDatabase:
    def __init__(self):
        self.table_name = "users"

    def get_user_verification(self, email: str) -> Optional[UserVerification]:
        query = f"""
        SELECT id, hashed_password FROM {self.table_name} WHERE email = %s
        """
        result = fetch_query(query, (email,))
        if result:
            user_data = result[0]
            return UserVerification (
                id=user_data[0],
                hashed_password=user_data[1]
            )
        return None
        
    def get_user(self, email: str) -> Optional[UserInDB]:
        query = f"""
        SELECT * FROM {self.table_name} WHERE email = %s
        """
        result = fetch_query(query, (email,))

        if result:
            user_data = result[0]
            return UserInDB(
                id = user_data[0],
                full_name=user_data[1],
                email=user_data[2],
                hashed_password=user_data[3],
                disabled=user_data[4]
            )
        return None
    
    def create_user(self, full_name: str, email: str, hashed_password: str, disabled: bool = False) -> None:
        query = f"""
            INSERT INTO {self.table_name} (full_name, email, hashed_password, disabled)
            VALUES ( %s, %s, %s, %s);
        """
        execute_query(query, (full_name, email, hashed_password, disabled))
        
    def delete_user(self, email: str) -> None:
        query = f"""
            DELETE FROM {self.table_name} WHERE email = %s;
        """
        execute_query(query, (email,))
        

class TaskDatabase:
    def __init__(self):
        self.table_name = "tasks"
    
    def add_task(self, user_id: int, title: str, due_date: datetime.datetime, description: Optional[str] = None, 
                 completed: bool = False, category: Optional[str] = None):
        data = {
            'user_id':    user_id,
            'title':      title,
            'due_date':   due_date,
            'description': description,
            'completed':   completed,
            'category':    category
        }
        
        fields   = []
        vals   = []
        for field, val in data.items():
            if val is not None:
                fields.append(field)
                vals.append(val)
                
        fields_query = ', '.join(fields)
        placeholders = ', '.join(['%s'] * len(vals))
        query = f"""
        INSERT INTO {self.table_name} ({fields_query})
        VALUES ({placeholders})
        RETURNING id
        """
        ret = fetch_query(query, tuple(vals))
        return ret[0][0]
        
    def delete_task(self, task_id: int, user_id: int):
        query = f"""
            DELETE FROM {self.table_name} WHERE id = %s AND user_id = %s;
        """
        execute_query(query, (task_id, user_id))
    
    def get_tasks(self, user_id: int):
        query = f"""
        SELECT id, title, description, due_date, completed, category FROM {self.table_name} WHERE user_id = %s
        """
        tasks = fetch_query(query, (user_id, ))
        return tasks
        
    
        

        
# global variables
user_db = UserDatabase()
task_db = TaskDatabase()

        
if __name__ == "__main__":
    task_db.add_task(10, "Homework", datetime.datetime(2025, 10, 10))
    # task_db.get_tasks(10)
    # task_db.add_task(9, "test", datetime.datetime(2025, 4, 10, 10, 3), "1")
    # task_db.delete_task(1)
    
        