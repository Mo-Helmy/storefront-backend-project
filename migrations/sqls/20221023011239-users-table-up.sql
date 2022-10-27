CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(100) UNIQUE NOT NULL, 
    firstName VARCHAR(100), 
    lastName VARCHAR(100), 
    password_digest VARCHAR  NOT NULL
    );