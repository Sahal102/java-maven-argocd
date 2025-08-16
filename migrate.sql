CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
