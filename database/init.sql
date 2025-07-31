-- init.sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT
);

INSERT INTO products (name, price, description) VALUES
('Monitor', 199.99, '24-inch HD monitor'),
('Mouse', 19.99, 'Wireless mouse only');

-- Users table to store login credentials and account metadata
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Optional test user
INSERT INTO users (username, email, password_hash)
VALUES ('testuser', 'test@example.com', 'hashed_password_123')
ON CONFLICT (email) DO NOTHING;

-- Wishlist table to track products saved by users
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id) -- prevent duplicate entries
);
