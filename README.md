# 📟 Fullstack Product Manager App

A production-ready fullstack web application for managing products using:

* ⚛️ React (Frontend)
* 🐍 Flask (Backend)
* 🐘 PostgreSQL (Database)
* 🎨 Tailwind CSS (Styling)

---

## 🛠️ Features

* View all products
* Add a new product
* Edit existing product details
* Delete products
* Fully styled with Tailwind CSS
* Modular, scalable React component structure
* RESTful API built with Flask
* Automated PostgreSQL database setup using environment variables and scripts

---

## 👰\ Tech Stack

| Layer         | Tech                        |
| ------------- | --------------------------- |
| Frontend      | React + Vite + Tailwind CSS |
| Backend       | Flask + Flask-CORS          |
| Database      | PostgreSQL (via psycopg2)   |
| Styling       | Tailwind CSS                |
| Routing       | React Router                |
| DB Automation | Bash + Python + dotenv      |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sharikh-nayab/fullstack.git
cd fullstack
```

---

### 2. Setup Python Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Setup PostgreSQL Database (Recommended)

```bash
# From the root of the project
cp database/.env.example .env
# Edit the .env file and update your DB_USER, DB_PASS, etc.
bash database/setup_db.sh
```

This will:

* Create the role and database (if missing)
* Apply all SQL migrations from `database/schema/`
* Seed data from `database/seeds/` if table is empty

To verify manually:

```bash
psql -h 127.0.0.1 -U your_user -d your_db -c "SELECT * FROM products;"
```

> 🔐 No password prompts — handled securely via environment variables

---

### 4. Start the Flask Backend

```bash
cd backend
source venv/bin/activate
python app.py
# Server running at http://127.0.0.1:5000/
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

## 📁 Folder Structure (High-Level)

```plaintext
fullstack/
├── backend/         # Flask app + API
├── frontend/        # React + Tailwind
├── database/        # PostgreSQL schema, seed, setup scripts
├── .env             # (Not committed) DB credentials
└── README.md        # You're here!
```

---

## ✅ Environment File Example (`.env`)

```dotenv
DB_NAME=productdb
DB_USER=appuser
DB_PASSWORD=supersecret
DB_HOST=127.0.0.1
DB_PORT=5432
ADMIN_USER=postgres
ADMIN_PASS=adminpassword
```

> ⚠️ Always keep `.env` private — never commit to version control

---

## 🧐 Tips

* Backend and database scripts are **idempotent** — safe to rerun
* All scripts assume PostgreSQL is locally accessible
* See `database/README.md` for deeper DB migration/seed logic

---

## 🤛️ Contributors

* Sharikh Nayab ([@sharikh-nayab](https://github.com/sharikh-nayab))

Pull requests and feedback welcome!

---

## 📜 License

MIT License
