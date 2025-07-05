from backend.models import UserInDB, UserVerification
import psycopg2
from psycopg2 import pool
from contextlib import contextmanager

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

    def get_user_verification(self, email: str) -> UserVerification | None:
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
        
    def get_user(self, email: str) -> UserInDB | None:
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
        
user_db = UserDatabase()

        
if __name__ == "__main__":
    user_db = UserDatabase()
    
    user_db.delete_user("test")
    # user_db.create_user("test", "Test User", "test@gmail.com", "password", False)
    print(user_db.get_user("test"))
        