# 🧾 Fullstack Product Manager App

A production-ready fullstack web application for managing products using:

- ⚛️ React (Frontend)
- 🐍 Flask (Backend)
- 🐘 PostgreSQL (Database)
- 🎨 Tailwind CSS (Styling)
---

## 🛠️ Features

- View all products
- Add a new product
- Edit existing product details
- Delete products
- Fully styled with Tailwind CSS
- Modular, scalable React component structure
- RESTful API built with Flask

---

## 🧰 Tech Stack

| Layer        | Tech                   |
|--------------|------------------------|
| Frontend     | React + Vite + Tailwind CSS |
| Backend      | Flask + Flask-CORS     |
| Database     | PostgreSQL (via psycopg2) |
| Styling      | Tailwind CSS           |
| Routing      | React Router           |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sharikh-nayab/fullstack.git
cd fullstack

cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

CREATE DATABASE productdb;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT
);

python app.py
# Server running at http://127.0.0.1:5000/


cd frontend
npm install
npm run dev
# Open http://localhost:5173
