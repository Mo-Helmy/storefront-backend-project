CREATE TYPE status AS ENUM ('active', 'complete');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status status  NOT NULL DEFAULT 'active',
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE 
    );

