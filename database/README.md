# Database Setup Guide

This README provides step-by-step instructions for setting up the PostgreSQL database for this project. Share this with your friend so they can get the database up and running without trouble.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure](#directory-structure)
3. [Configuration](#configuration)
4. [Setup Steps](#setup-steps)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Tips for Review](#tips-for-review)

---

## Prerequisites

Before starting, ensure the following are installed and accessible:

* **PostgreSQL Server** (v17 or compatible) running locally or on a remote host.
* **Python 3.8+** with a virtual environment (venv).
* **Git** for cloning the repo.
* **Bash shell** (Git Bash on Windows or Terminal on macOS/Linux).

---

## Directory Structure

Focus on the `database/` folder:

```plaintext
database/
├── .env.example       # Example file showing required environment variables
├── setup_db.sh        # Bash wrapper to invoke the Python runner
├── setup_db.py        # Python script to load .env, create role/db, and run migrations
├── schema/            # Migration SQL files (applied in filename order)
│   ├── 001_init.sql
│   └── 002_add_tables.sql
└── seeds/             # Optional SQL seed files
    └── initial_data.sql
```

---

## Configuration

1. **Copy** the example env file:

   ```bash
   cd database
   cp .env.example .env
   ```
2. **Open** `database/.env` in your editor and fill in your own values:

   ```dotenv
   # Database to create and migrate
   ```

db\_name=myapp\_dev
DB\_NAME=myapp\_dev
DB\_USER=appuser
DB\_PASS=supersecret123
DB\_HOST=localhost
DB\_PORT=5432

# Admin credentials to bootstrap the DB and role

ADMIN\_USER=postgres
ADMIN\_PASS=admin\_admin\_password

````
3. **Save** and ensure `.env` is **gitignored** to keep credentials private.

---

## Setup Steps

1. **Activate** the Python virtual environment:
```bash
cd ..             # back to project root
source venv/Scripts/activate   # Windows (Git Bash)
# or
source venv/bin/activate      # macOS/Linux
````

2. **Install** dependencies (if not already):

   ```bash
   pip install -r requirements.txt
   ```
3. **Verify** PostgreSQL is running:

   * **Linux/macOS**:

     ```bash
     systemctl status postgresql
     ```
   * **Windows (PowerShell as Admin)**:

     ```powershell
     Get-Service postgresql*
     Start-Service postgresql-x64-17
     ```
4. **Run** the setup script:

   ```bash
   bash database/setup_db.sh
   ```

This script will:

* Detect the correct Python interpreter.
* Load your `.env` variables.
* Create the application role (`DB_USER`) if it doesn’t exist.
* Create the database (`DB_NAME`) owned by `DB_USER` if missing.
* Apply all migrations in `schema/`.
* Optionally load seeds in `seeds/`.

---

## Verification

After completion, you should see output similar to:

```plaintext
→ role 'appuser' already exists
→ database 'myapp_dev' already exists
  → applying 001_init.sql
  → applying 002_add_tables.sql
✅ database & role setup complete.
```

You can also manually connect:

```bash
psql -h localhost -U appuser -d myapp_dev -c "\dt"
```

and verify the tables.

---

## Troubleshooting

* **`ModuleNotFoundError: No module named 'dotenv'`**:

  * Ensure your venv is activated and run `pip install python-dotenv`.
* **`OperationalError: password authentication failed`**:

  * Double-check `DB_PASS` and `ADMIN_PASS` in `.env`.
* **`Connection refused`**:

  * Ensure PostgreSQL is listening on the configured host and port.
* **Permission issues**:

  * On macOS/Linux, ensure `chmod +x database/setup_db.sh`.

---

## Tips for Review

* Check that the **order** of SQL files in `schema/` matches migration dependencies.
* Verify that **sensitive data** is only in `.env`, not in code.
* Confirm **idempotency** by rerunning the script: it should skip existing objects.
* Test on a fresh database/cluster to ensure the script bootstraps from zero.

---

That’s it! Your friend can follow this guide to set up the database reliably.
