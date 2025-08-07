from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.pg_connection import get_connection

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/orders", methods=["POST"])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 1️⃣ Insert order
        print(f"[orders] inserting order for user={user_id}, product={product_id}")
        cur.execute("""
            INSERT INTO orders (user_id, product_id)
            VALUES (%s, %s)
            RETURNING id
        """, (user_id, product_id))
        order_id = cur.fetchone()[0]
        print(f"[orders] order_id returned: {order_id}")

        # 2️⃣ Lookup price
        cur.execute("SELECT price FROM products WHERE id = %s", (product_id,))
        row = cur.fetchone()
        if not row:
            raise RuntimeError("Product not found when fetching price")
        product_price = row[0]
        print(f"[orders] product_price fetched: {product_price}")

        # 3️⃣ Create invoice
        print(f"[orders] creating invoice for order={order_id}")
        cur.execute("""
            INSERT INTO invoices (user_id, order_id, total)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (user_id, order_id, product_price))
        invoice_id = cur.fetchone()[0]
        print(f"[orders] invoice created with id={invoice_id}")

        # 4️⃣ Remove from wishlist
        print(f"[orders] deleting from wishlist for user={user_id}, product={product_id}")
        cur.execute("""
            DELETE FROM wishlist
            WHERE user_id = %s AND product_id = %s
        """, (user_id, product_id))
        deleted = cur.rowcount
        print(f"[orders] wishlist rows deleted: {deleted}")

        conn.commit()
        cur.close()

        return jsonify({
            "message": "Order placed, invoice generated, wishlist updated",
            "order_id": order_id,
            "invoice_id": invoice_id,
            "wishlist_deleted": deleted
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        print("[orders] ERROR in place_order:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
