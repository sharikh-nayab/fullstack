from flask import Blueprint, request, jsonify
from db.pg_connection import get_connection
from utils.security import hash_password, verify_password
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not all([username, email, password]):
        return jsonify(error="All fields are required"), 400

    hashed = hash_password(password)
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id FROM users WHERE email=%s OR username=%s;",
            (email, username)
        )
        if cur.fetchone():
            return jsonify(error="User exists"), 409
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s,%s,%s) RETURNING id;",
            (username, email, hashed)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
    conn.close()
    return jsonify(id=user_id, message="Registered"), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not all([email, password]):
        return jsonify(error="Email and password required"), 400

    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, username, password_hash FROM users WHERE email=%s;",
            (email,)
        )
        row = cur.fetchone()
    conn.close()

    if not row or not verify_password(password, row[2]):
        return jsonify(error="Invalid credentials"), 401

    identity = {"id": row[0], "username": row[1]}
    token = create_access_token(identity=identity)
    return jsonify(access_token=token), 200
