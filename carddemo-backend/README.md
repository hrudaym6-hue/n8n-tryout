# CardDemo Backend

Node.js + Express + PostgreSQL backend for the CardDemo credit card authorization system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create PostgreSQL database:
```bash
createdb carddemo
```

3. Initialize database schema:
```bash
psql -d carddemo -f database/schema.sql
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your database credentials and JWT secret.

## Running

Development mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Accounts
- GET `/api/accounts` - List accounts (with pagination)
- GET `/api/accounts/:id` - Get account details
- PUT `/api/accounts/:id` - Update account

### Cards
- GET `/api/cards` - List cards (with filters)
- GET `/api/cards/:cardNumber` - Get card details
- PUT `/api/cards/:cardNumber` - Update card

### Transactions
- GET `/api/transactions` - List transactions (with filters)
- GET `/api/transactions/:id` - Get transaction details
- POST `/api/transactions` - Create transaction

### Transaction Types (Admin only)
- GET `/api/transaction-types` - List transaction types
- POST `/api/transaction-types` - Create transaction type
- PUT `/api/transaction-types/:code` - Update transaction type
- DELETE `/api/transaction-types/:code` - Delete transaction type

### Authorizations
- GET `/api/authorizations` - List authorizations
- POST `/api/authorizations` - Create authorization

### Users (Admin only)
- GET `/api/users` - List users
- POST `/api/users` - Create user
- PUT `/api/users/:userId` - Update user
- DELETE `/api/users/:userId` - Delete user

### Customers
- GET `/api/customers` - List customers
- GET `/api/customers/:id` - Get customer details
