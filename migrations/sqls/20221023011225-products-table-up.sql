CREATE TABLE products (
    id SERIAL PRIMARY KEY, 
    name VARCHAR NOT NULL, 
    price FLOAT NOT NULL, 
    category VARCHAR(100)
    );