import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_connection():
    print("Connecting to DB with:")
    print("Host:", os.getenv("DB_HOST"))
    print("DB:", os.getenv("DB_NAME"))
    print("User:", os.getenv("DB_USER"))
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS")
    )
