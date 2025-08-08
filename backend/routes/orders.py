from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.pg_connection import get_connection

orders_bp = Blueprint("orders", __name__)

# ─── POST /orders ───────────────────────────────────────────────
@orders_bp.route("/orders", methods=["POST"])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get("product_id")
    if not product_id:
        return jsonify(error="Product ID is required"), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        # 1) Create order
        cur.execute("""
            INSERT INTO orders (user_id, product_id)
            VALUES (%s, %s)
            RETURNING id
        """, (user_id, product_id))
        order_id = cur.fetchone()[0]

        # 2) Get price
        cur.execute("SELECT price FROM products WHERE id=%s", (product_id,))
        price_row = cur.fetchone()
        if not price_row:
            conn.rollback()
            return jsonify(error="Product not found"), 404
        price = price_row[0]

        # 3) Create invoice
        cur.execute("""
            INSERT INTO invoices (user_id, order_id, total)
            VALUES (%s, %s, %s)
        """, (user_id, order_id, price))

        # 4) Remove from wishlist
        cur.execute("""
            DELETE FROM wishlist
            WHERE user_id=%s AND product_id=%s
        """, (user_id, product_id))
        deleted = cur.rowcount

        conn.commit()
        return jsonify({
            "message": "Order placed and invoice generated",
            "order_id": order_id,
            "wishlist_deleted": deleted
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify(error=str(e)), 500

    finally:
        cur.close()
        conn.close()


# ─── GET /orders ────────────────────────────────────────────────
@orders_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT p.name, p.description, p.price, o.ordered_at
            FROM orders o
            JOIN products p ON p.id = o.product_id
            WHERE o.user_id = %s
            ORDER BY o.ordered_at DESC
        """, (user_id,))
        rows = cur.fetchall()

        orders = [{
            "name":   row[0],
            "description": row[1],
            "price":  float(row[2]),
            "ordered_at": row[3].isoformat()
        } for row in rows]

        return jsonify(orders=orders), 200

    except Exception as e:
        return jsonify(error=str(e)), 500

    finally:
        cur.close()
        conn.close()
