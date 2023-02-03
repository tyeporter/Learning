CREATE TABLE orders (id SERIAL PRIMARY KEY, status CHAR(1), user_id uuid REFERENCES users(id));
