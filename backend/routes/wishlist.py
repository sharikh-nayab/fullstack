from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.pg_connection import get_connection

wishlist_bp = Blueprint("wishlist", __name__)

@wishlist_bp.route("/wishlist", methods=["POST"])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    print("👤 JWT Identity:", user_id)
    data = request.get_json()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Insert into wishlist table (skip duplicates)
        cur.execute("""
            INSERT INTO wishlist (user_id, product_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
        """, (user_id["id"], product_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Product added to wishlist"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@wishlist_bp.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    print("👤 JWT Identity:", user_id)

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Fetch all wishlist items for the user
        cur.execute("""
            SELECT p.id, p.name, p.description, p.price
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = %s
        """, (user_id["id"],))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        # Format response as list of products
        wishlist = [
            {
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "price": float(row[3])
            }
            for row in rows
        ]

        return jsonify({"wishlist": wishlist}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
