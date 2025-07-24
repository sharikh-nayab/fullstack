#!/usr/bin/env python3
import os, glob
from pathlib import Path

# ── 1. Load .env ──
from dotenv import load_dotenv
load_dotenv(override=True)

# ── 2. Config (no hard-coded passwords!) ──
DB_NAME   = os.getenv("DB_NAME", "app_user_name")
DB_USER   = os.getenv("DB_USER", "db_user_name")
DB_PASS   = os.getenv("DB_PASS")       # must be in .env
DB_HOST   = os.getenv("DB_HOST", "localhost")
DB_PORT   = os.getenv("DB_PORT", "5432")
ADMIN_USER= os.getenv("ADMIN_USER", "postgres")
ADMIN_PASS= os.getenv("ADMIN_PASS")    # must be in .env

# sanity checks
for var in ("DB_PASS","ADMIN_PASS"):
    if not globals()[var]:
        raise RuntimeError(f"Missing required env var: {var}")

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

BASE_DIR   = Path(__file__).parent
SCHEMA_DIR = BASE_DIR / "schema"
SEEDS_DIR  = BASE_DIR / "seeds"

# ── Connect as admin (to create roles & databases) ──
def connect_admin(dbname="postgres"):
    return psycopg2.connect(
        dbname=dbname,
        user=ADMIN_USER,
        password=ADMIN_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

# ── Connect as app user (for migrations) ──
def connect_app(dbname):
    return psycopg2.connect(
        dbname=dbname,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

# ── 3. Create the application role if missing ──
def ensure_role():
    conn = connect_admin()
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_roles WHERE rolname=%s", (DB_USER,))
    if cur.fetchone():
        print(f"→ role '{DB_USER}' already exists")
    else:
        print(f"→ creating role '{DB_USER}'")
        # LOGIN privilege and set password
        cur.execute(
            f"CREATE ROLE \"{DB_USER}\" LOGIN PASSWORD %s",
            (DB_PASS,)
        )
    cur.close()
    conn.close()

# ── 4. Create the database if missing ──
def ensure_database():
    conn = connect_admin()
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (DB_NAME,))
    if cur.fetchone():
        print(f"→ database '{DB_NAME}' already exists")
    else:
        print(f"→ creating database '{DB_NAME}'")
        cur.execute(f'CREATE DATABASE "{DB_NAME}" OWNER "{DB_USER}"')
    cur.close()
    conn.close()

# ── 5. Apply migrations & seeds ──
def run_sql_file(conn, path: Path):
    print(f"  → applying {path.name}")
    sql = path.read_text()
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()

def apply_migrations():
    conn = connect_app(DB_NAME)
    for sql_file in sorted(SCHEMA_DIR.glob("*.sql")):
        run_sql_file(conn, sql_file)
    if SEEDS_DIR.exists():
        for sql_file in sorted(SEEDS_DIR.glob("*.sql")):
            run_sql_file(conn, sql_file)
    conn.close()

# ── 6. Main ──
if __name__ == "__main__":
    ensure_role()
    ensure_database()
    apply_migrations()
    print("✅ database & role setup complete.")
