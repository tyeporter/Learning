CREATE TABLE user_sessions (id SERIAL PRIMARY KEY, secret text, user_id uuid REFERENCES users(id));
