from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.pg_connection import get_connection
from flask import send_file
from io import BytesIO
from reportlab.pdfgen import canvas


invoices_bp = Blueprint("invoices", __name__)

@invoices_bp.route("/invoice", methods=["POST"])
@jwt_required()
def generate_invoice():
    user_id = get_jwt_identity()
    data = request.get_json()
    order_id = data.get("order_id")
    total = data.get("total")

    if not order_id or not total:
        return jsonify({"error": "Order ID and total are required"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Insert into invoice table (one per order)
        cur.execute("""
            INSERT INTO invoices (user_id, order_id, total)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (user_id, order_id, total))

        invoice_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Invoice created", "invoice_id": invoice_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoices_bp.route("/invoices", methods=["GET"])
@jwt_required()
def get_invoices():
    user_id = get_jwt_identity()

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT i.id, p.name, i.total, i.generated_at
            FROM invoices i
            JOIN orders o ON i.order_id = o.id
            JOIN products p ON o.product_id = p.id
            WHERE i.user_id = %s
            ORDER BY i.generated_at DESC
        """, (user_id,))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        invoices = [
            {
                "invoice_id": row[0],
                "product_name": row[1],
                "price": float(row[2]),
                "generated_at": row[3].isoformat()
            }
            for row in rows
        ]

        return jsonify({"invoices": invoices}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoices_bp.route("/invoice/<int:invoice_id>/pdf", methods=["GET"])
def download_invoice(invoice_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Get invoice and product info
        cur.execute("""
            SELECT p.name, p.description, i.total, i.generated_at
            FROM invoices i
            JOIN orders o ON i.order_id = o.id
            JOIN products p ON o.product_id = p.id
            WHERE i.id = %s """, (invoice_id,))

        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return jsonify({"error": "Invoice not found"}), 404

        # Generate PDF in memory
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer)
        pdf.setFont("Helvetica", 12)

        pdf.drawString(50, 800, f"Invoice #{invoice_id}")
        pdf.drawString(50, 780, f"Product: {row[0]}")
        pdf.drawString(50, 760, f"Description: {row[1]}")
        pdf.drawString(50, 740, f"Total: ₹{row[2]}")
        pdf.drawString(50, 720, f"Issued: {row[3].strftime('%Y-%m-%d %H:%M')}")

        pdf.showPage()
        pdf.save()
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"invoice_{invoice_id}.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500