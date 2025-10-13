DROP TABLE IF EXISTS authorizations CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS transaction_types CASCADE;
DROP TABLE IF EXISTS transaction_categories CASCADE;
DROP TABLE IF EXISTS card_xref CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS disclosure_groups CASCADE;

CREATE TABLE users (
    user_id VARCHAR(8) PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type CHAR(1) NOT NULL CHECK (user_type IN ('U', 'A')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(15),
    ssn VARCHAR(9),
    email VARCHAR(50),
    address_line1 VARCHAR(50),
    address_line2 VARCHAR(50),
    city VARCHAR(25),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    fico_credit_score INTEGER CHECK (fico_credit_score >= 300 AND fico_credit_score <= 850),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disclosure_groups (
    group_id VARCHAR(10) PRIMARY KEY,
    group_description VARCHAR(50),
    interest_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_id BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id),
    account_status CHAR(1) NOT NULL CHECK (account_status IN ('Y', 'N')),
    account_open_date DATE,
    account_expiry_date DATE,
    current_balance DECIMAL(12, 2) DEFAULT 0.00,
    credit_limit DECIMAL(12, 2) NOT NULL,
    cash_credit_limit DECIMAL(12, 2),
    current_cycle_credit DECIMAL(12, 2) DEFAULT 0.00,
    current_cycle_debit DECIMAL(12, 2) DEFAULT 0.00,
    group_id VARCHAR(10) REFERENCES disclosure_groups(group_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    card_number VARCHAR(16) PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(account_id),
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id),
    card_type VARCHAR(10),
    expiry_month VARCHAR(2),
    expiry_year VARCHAR(4),
    cvv_code VARCHAR(3),
    embossed_name VARCHAR(50),
    card_status CHAR(1) NOT NULL CHECK (card_status IN ('Y', 'N')),
    is_primary CHAR(1) DEFAULT 'N' CHECK (is_primary IN ('Y', 'N')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE card_xref (
    xref_id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) NOT NULL REFERENCES cards(card_number),
    account_id BIGINT NOT NULL REFERENCES accounts(account_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_categories (
    category_code VARCHAR(2) PRIMARY KEY,
    category_description VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_types (
    type_code VARCHAR(2) PRIMARY KEY,
    type_description VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id VARCHAR(16) PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(account_id),
    card_number VARCHAR(16) NOT NULL REFERENCES cards(card_number),
    transaction_type_code VARCHAR(2) NOT NULL REFERENCES transaction_types(type_code),
    transaction_category_code VARCHAR(2) NOT NULL REFERENCES transaction_categories(category_code),
    transaction_source VARCHAR(10),
    transaction_description VARCHAR(100),
    transaction_amount DECIMAL(12, 2) NOT NULL,
    merchant_id VARCHAR(9),
    merchant_name VARCHAR(50),
    merchant_city VARCHAR(25),
    merchant_zip VARCHAR(10),
    origin_date TIMESTAMP,
    process_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authorizations (
    auth_id SERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(account_id),
    card_number VARCHAR(16) NOT NULL REFERENCES cards(card_number),
    transaction_amount DECIMAL(12, 2) NOT NULL,
    merchant_id VARCHAR(9),
    merchant_name VARCHAR(50),
    merchant_city VARCHAR(25),
    merchant_zip VARCHAR(10),
    auth_date TIMESTAMP NOT NULL,
    auth_time TIMESTAMP NOT NULL,
    response_code VARCHAR(2) NOT NULL,
    approved_amount DECIMAL(12, 2) DEFAULT 0.00,
    reason_code VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_cards_account ON cards(account_id);
CREATE INDEX idx_cards_customer ON cards(customer_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_card ON transactions(card_number);
CREATE INDEX idx_transactions_date ON transactions(process_date);
CREATE INDEX idx_authorizations_account ON authorizations(account_id);
CREATE INDEX idx_authorizations_card ON authorizations(card_number);
CREATE INDEX idx_authorizations_date ON authorizations(auth_date);

INSERT INTO transaction_categories (category_code, category_description) VALUES
('01', 'Merchandise'),
('02', 'Bill Payment'),
('03', 'Cash Advance'),
('04', 'Balance Transfer'),
('05', 'Interest Charge'),
('06', 'Late Fee'),
('07', 'Annual Fee'),
('08', 'Service Fee'),
('09', 'Credit Adjustment'),
('10', 'Other');

INSERT INTO transaction_types (type_code, type_description) VALUES
('01', 'Interest Charge'),
('02', 'Bill Payment'),
('03', 'Purchase'),
('04', 'Cash Advance'),
('05', 'Balance Transfer'),
('06', 'Fee'),
('07', 'Credit'),
('08', 'Refund'),
('09', 'Adjustment'),
('10', 'Other');

INSERT INTO disclosure_groups (group_id, group_description, interest_rate) VALUES
('DEFAULT', 'Default Interest Rate', 19.99),
('PREMIUM', 'Premium Customer Rate', 14.99),
('STANDARD', 'Standard Customer Rate', 17.99),
('INTRO', 'Introductory Rate', 0.00);
