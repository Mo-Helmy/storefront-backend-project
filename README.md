# Storefront Backend Project

## API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

### instructions

#### setup databases

- in psql terminal run the following:

  - CREATE USER full_stack_user WITH PASSWORD '12345'; [create new user]
  - CREATE DATABASE store; [create dev database]
  - CREATE DATABASE store_test; [create test database]
  - GRANT ALL PRIVILEGES ON DATABASE store TO full_stack_user; [grant all privileges to user on store database]
  - GRANT ALL PRIVILEGES ON DATABASE store_test TO full_stack_user; [grant all privileges to user on store database]

- .env file setup:

  - ENV=dev

  - POSTGRES_HOST=localhost
  - POSTGRES_DB=store
  - POSTGRES_TEST_DB=store_test
  - POSTGRES_USER=full_stack_user
  - POSTGRES_PASSWORD=12345
  - BCRYPT_PASSWORD=my_sercret_password
  - SALT_ROUNDS=10
  - TOKEN_SECRET=mohamedhelmymahmoud123

- to start the server run the following:

  - [server running on the default host and port 'localhost:3000'] [you can configer it in .env]
  - [database running on the default port '5432'] [you can configer it in .env]
    - npm install
    - npm run db-up ['db-migrate up' to setup all dev database migration]
    - npm run watch [server will be started, check api endpoints to try it]

- to test the server run the following:
  - npm run test

### scripts

- watch: npm run watch
- start: npm start
- build: npm run build
- test: npm test

### API Endpoints

#### Products

- Index

  - '/api/products' (get)

- Show

  - '/api/products/:productId (get)

- Create [token required]
  - '/api/products' (post)
  - request.body Ex.
    - {
      "name": "product 60",
      "price": 60.99,
      "category": "category1"
      }
- [OPTIONAL] Top 5 most popular products

  - '/api/products/popular?limit=5 (get)

- [OPTIONAL] Products by category (args: product category)

  - '/api/products?category=cat1'

- Update [token required]

  - '/api/ptoducts/:productId' (put)
  - request.body Ex.
    - {
      "name": "product 60",
      "price": 60.99,
      "category": "category1"
      }

- Delete [token required]
  - '/api/products/:productId' (delete)

#### Users

- Index [token required]

  - '/api/users' (get) (authenticate)

- Show [token required]

  - '/api/users/:userId' (get) (autherization)

- Create N[token required] (generate jwt token)

  - '/api/users' (post)
  - request.body Ex.
    - {
      "username": "mohelmy",
      "firstname": "mo",
      "lastname": "diab",
      "password": "1234"
      }

- Auth (generate jwt token)
  - '/api/users/auth' (post)
  - request.body Ex.
    - {
      "username": "mohelmy",
      "password": "1234"
      }

#### Orders

- Current Order by user (args: user id)[token required]

  - '/api/users/:userId/orders' (get)

- Current Products by order id (args: user id, order id)[token required]

  - '/api/users/:userId/orders/:orderId' (get)

- [OPTIONAL] Completed Orders by user (args: user id)[token required]
  - '/api/users/:userId/orders?status=complete' (get)

### Data Shapes

#### Product

- id
- name (not null)
- price (not null)
- [OPTIONAL] category

#### User

- id
- username (unique, not null)
- firstName
- lastName
- password(not null)

#### Orders

- id
- user_id
- status of order (TYPE ENUM(active or complete), not null)

#### order_products

- id
- order_id
- product_id
- quantity of each product in the order (not null default 1)

### Database schema

- TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  password_digest VARCHAR NOT NULL
  );

- TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price FLOAT NOT NULL,
  category VARCHAR(100)
  );

- TYPE status AS ENUM ('active', 'complete');
- TABLE orders (
  id SERIAL PRIMARY KEY,
  status status NOT NULL DEFAULT 'active',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

- TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1
  );
