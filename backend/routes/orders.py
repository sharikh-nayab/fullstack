from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.pg_connection import get_connection

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/orders", methods=["POST"])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Insert order
        cur.execute("""
            INSERT INTO orders (user_id, product_id)
            VALUES (%s, %s)
            RETURNING id
        """, (user_id, product_id))
        order_id = cur.fetchone()[0]

        # Get product price
        cur.execute("SELECT price FROM products WHERE id = %s", (product_id,))
        product_price = cur.fetchone()[0]

        # Create invoice automatically
        cur.execute("""
            INSERT INTO invoices (user_id, order_id, total)
            VALUES (%s, %s, %s)
        """, (user_id, order_id, product_price))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Order placed and invoice generated",
            "order_id": order_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@orders_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT p.name, p.description, p.price, o.ordered_at
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = %s
            ORDER BY o.ordered_at DESC
        """, (user_id,))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        orders = [
            {
                "name": row[0],
                "description": row[1],
                "price": float(row[2]),
                "ordered_at": row[3].isoformat()  # or use .strftime()
            }
            for row in rows
        ]

        return jsonify({"orders": orders}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

