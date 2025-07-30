import os
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
from db.pg_connection import get_connection
from routes.auth import auth_bp
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Initialize JWT
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # Logging + error handler
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger('backend')

    # Health check
    @app.route('/', methods=['GET'])
    def home():
        return jsonify(msg="Flask backend connected to PostgreSQL!"), 200

    # CRUD routes for products, protected
    @app.route('/api/products', methods=['GET'])
    @jwt_required()
    def get_products():
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name, price, description FROM products;")
            rows = cursor.fetchall()
        conn.close()
        return jsonify([
            {"id": id, "name": name, "price": float(price), "description": desc}
            for id, name, price, desc in rows
        ]), 200

    @app.route('/api/products', methods=['POST'])
    @jwt_required()
    def add_product():
        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        if not name or price is None:
            return jsonify(error="Name and price are required"), 400

        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO products (name, price, description) VALUES (%s, %s, %s) RETURNING id;",
                (name, price, data.get('description'))
            )
            new_id = cursor.fetchone()[0]
            conn.commit()
        conn.close()
        return jsonify(id=new_id, message="Product added"), 201

    @app.route('/api/products/<int:product_id>', methods=['GET'])
    @jwt_required()
    def get_product(product_id):
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name, price, description FROM products WHERE id = %s;", (product_id,))
            row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify(error="Not found"), 404
        id, name, price, desc = row
        return jsonify(id=id, name=name, price=float(price), description=desc), 200

    @app.route('/api/products/<int:product_id>', methods=['PUT'])
    @jwt_required()
    def update_product(product_id):
        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        if not name or price is None:
            return jsonify(error="Name and price are required"), 400

        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE products SET name=%s, price=%s, description=%s WHERE id=%s RETURNING id;",
                (name, price, data.get('description'), product_id)
            )
            updated = cursor.fetchone()
            conn.commit()
        conn.close()
        if not updated:
            return jsonify(error="Not found"), 404
        return jsonify(message="Updated"), 200

    @app.route('/api/products/<int:product_id>', methods=['DELETE'])
    @jwt_required()
    def delete_product(product_id):
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM products WHERE id=%s RETURNING id;", (product_id,))
            deleted = cursor.fetchone()
            conn.commit()
        conn.close()
        if not deleted:
            return jsonify(error="Not found"), 404
        return jsonify(message="Deleted"), 200
    
    @app.errorhandler(Exception)
    def handle_uncaught_exception(e):
        logger.exception("Catch-all exception:")
        return jsonify(error="Something went wrong", details=str(e)), 500

    return app

if __name__ == '__main__':
    print("🚀 Starting Flask app in production mode...")
    app = create_app()
    debug_flag = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1']
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=debug_flag)