CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, name VARCHAR(100) NOT NULL, description TEXT, price NUMERIC(6, 2) NOT NULL, category_id BIGINT REFERENCES product_categories(id));
