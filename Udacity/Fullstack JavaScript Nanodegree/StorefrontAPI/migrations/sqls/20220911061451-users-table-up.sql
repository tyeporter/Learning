CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, username VARCHAR(50) NOT NULL, password_digest VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), level INTEGER DEFAULT 0);
