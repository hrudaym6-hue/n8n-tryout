CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password VARCHAR(100) NOT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(30) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL,
    balance FLOAT NOT NULL DEFAULT 0,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT NOW(),
    account_id INTEGER NOT NULL REFERENCES accounts(id)
);
