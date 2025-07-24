from flask import Flask, jsonify, request
from flask_cors import CORS
from db.pg_connection import get_connection  # adjust this path if needed

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask backend connected to PostgreSQL!"

# ✅ GET all products (returns list of JSON objects)
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    products = [
        {
            "id": row[0],
            "name": row[1],
            "price": float(row[2]),
            "description": row[3]
        } for row in rows
    ]
    return jsonify(products)

# ✅ POST a new product
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')

    if not name or not price:
        return jsonify({"error": "Name and price are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, price, description) VALUES (%s, %s, %s)",
        (name, price, description)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product added successfully"}), 201

# ✅ GET a product by ID (return as JSON object)
@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = %s;", (id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        product = {
            "id": row[0],
            "name": row[1],
            "price": float(row[2]),
            "description": row[3]
        }
        return jsonify(product)
    else:
        return jsonify({"error": "Product not found"}), 404

# ✅ UPDATE product by ID
@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')

    if not name or not price:
        return jsonify({"error": "Name and price are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE products SET name = %s, price = %s, description = %s WHERE id = %s",
        (name, price, description, id)
    )
    conn.commit()
    affected_rows = cursor.rowcount
    cursor.close()
    conn.close()

    if affected_rows == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Product updated successfully"})

# ✅ DELETE product by ID
@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = %s", (id,))
    conn.commit()
    affected_rows = cursor.rowcount
    cursor.close()
    conn.close()

    if affected_rows == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Product deleted successfully"})

# ✅ Run app on all interfaces so Docker can access it
if __name__ == '__main__':
    print("🚀 Starting Flask app...")
    app.run(host="0.0.0.0", port=5000, debug=True)
