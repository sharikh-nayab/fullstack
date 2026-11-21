# Fullstack Product Manager App

A production-ready fullstack web application for managing products using:

* ⚛️ React (Frontend)
* 🐍 Flask (Backend)
* 🐘 PostgreSQL (Database)
* 🎨 Tailwind CSS (Styling)

---

## Features

* View all products
* Add a new product
* Edit existing product details
* Delete products
* Fully styled with Tailwind CSS
* Modular, scalable React component structure
* RESTful API built with Flask
* Automated PostgreSQL database setup using environment variables and scripts

---

## Tech Stack

| Layer         | Tech                        |
| ------------- | --------------------------- |
| Frontend      | React + Vite + Tailwind CSS |
| Backend       | Flask + Flask-CORS          |
| Database      | PostgreSQL (via psycopg2)   |
| Styling       | Tailwind CSS                |
| Routing       | React Router                |
| DB Automation | Bash + Python + dotenv      |

---

## Architecture Overview

This fullstack app follows a **3-tier architecture** pattern, with clear separation between the frontend, backend, and database layers. It is designed for modularity, security, and ease of deployment via Docker.

### High-Level Flow

```

\[ React Frontend ]
|
\| (HTTP: REST API calls)
v
\[ Flask Backend ]
|
\| (SQL Queries via psycopg2)
v
\[ PostgreSQL Database ]

````


### Component Breakdown

#### 1. **Frontend**
- **Path**: `frontend/`
- **Runs On**: `http://localhost:5173` (Dev) / `:3000` (Docker)
- **Tools**: React, Vite, Tailwind CSS, React Router
- **Purpose**: UI rendering, user input, and API consumption

#### 2. **Backend**
- **Path**: `backend/`
- **Runs On**: `http://localhost:5000`
- **Tools**: Flask, Flask-CORS, psycopg2
- **Purpose**: Business logic, API endpoints, DB communication

#### 3. **Database**
- **Path**: `database/`
- **Port**: `5432`
- **Tools**: PostgreSQL, Bash, SQL scripts
- **Purpose**: Persistent storage of product and user data

#### Docker Orchestration
- Managed by `docker-compose.yml`
- Spins up: frontend + backend + database
- No local setup needed if Docker is used

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sharikh-nayab/fullstack.git
cd fullstack
````

---

### 2. Setup Python Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Setup PostgreSQL Database

```bash
cp database/.env.example .env
# Edit the .env file with DB_USER, DB_PASS, etc.
bash database/setup_db.sh
```

Verify:

```bash
psql -h 127.0.0.1 -U your_user -d your_db -c "SELECT * FROM products;"
```

---

### 4. Start the Flask Backend

```bash
cd backend
source venv/bin/activate
python app.py
# Running at http://127.0.0.1:5000/
```

---

### 5. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## Run with Docker (Optional)

```bash
# From the project root
docker-compose up --build
```

This will:

* Build and run frontend, backend, and PostgreSQL containers
* Setup the database automatically
* Serve the app at:

  * Frontend → `http://localhost:3000`
  * Backend → `http://localhost:5000`

To stop:

```bash
docker-compose down
```

---

## Folder Structure (High-Level)

```
fullstack/
├── backend/         # Flask app + API
├── frontend/        # React + Tailwind
├── database/        # PostgreSQL schema, seed, setup scripts
├── .env             # (Not committed) DB credentials
├── docker-compose.yml
└── README.md        # You're here!
```

---

## Example Environment File (.env)

```env
DB_NAME=productdb
DB_USER=appuser
DB_PASSWORD=supersecret
DB_HOST=db
DB_PORT=5432
ADMIN_USER=postgres
ADMIN_PASS=adminpassword
```

> ⚠️ Never commit `.env` to version control

---

## Tips

* Backend and DB scripts are **idempotent** – safe to rerun
* `setup_db.sh` ensures schema and seed data are consistent
* Works both locally and in Docker environments
* See `database/README.md` for advanced DB migration details

---

## Contributors

**Sharikh Nayab** [@sharikh-nayab](https://github.com/sharikh-nayab)
