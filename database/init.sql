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
