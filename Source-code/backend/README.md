# CardDemo Backend API

A production-ready Node.js + Express backend implementing business logic extracted from COBOL CardDemo application. This backend provides RESTful APIs for credit card account management, transaction processing, and authorization decisions.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Business Logic](#business-logic)
- [Development](#development)

## Overview

This backend implements the complete business logic from the COBOL CardDemo application, including:

- User authentication and authorization
- Account management with credit limit tracking
- Credit card management
- Transaction processing with balance updates
- Authorization decisions based on credit limits
- Interest calculation
- Customer management
- Comprehensive validation rules

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Authentication**: express-session with bcrypt
- **Database**: In-memory (Map structures) for POC
- **Testing**: Jest + Supertest
- **Logging**: Morgan
- **Validation**: Custom middleware implementing COBOL business rules

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Source-code/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration (see [Configuration](#configuration))

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=change-this-secret-in-production
DATABASE_TYPE=in-memory
LOG_LEVEL=info
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| SESSION_SECRET | Secret for session management | (random) |
| DATABASE_TYPE | Database type | in-memory |
| LOG_LEVEL | Logging level | info |

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

### Health Check
```bash
curl http://localhost:3000/api/health
```

## API Documentation

All API endpoints require authentication (except `/api/auth/login` and `/api/auth/register`).

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "userId": "USER001",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "userType": "U"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "userId": "ADMIN001",
  "password": "admin123"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Verify Session
```http
GET /api/auth/verify
```

### Accounts

#### List Accounts
```http
GET /api/accounts?page=1&limit=10&accountStatus=Y
```

#### Get Account by ID
```http
GET /api/accounts/:id
```

#### Create Account (Admin only)
```http
POST /api/accounts
Content-Type: application/json

{
  "customerId": "1000000001",
  "creditLimit": 5000.00,
  "cashCreditLimit": 1000.00,
  "accountStatus": "Y",
  "groupId": "DEFAULT"
}
```

#### Update Account (Admin only)
```http
PUT /api/accounts/:id
Content-Type: application/json

{
  "creditLimit": 7500.00,
  "accountStatus": "Y"
}
```

#### Get Available Credit
```http
GET /api/accounts/:id/available-credit
```

Response:
```json
{
  "creditLimit": 5000.00,
  "currentBalance": 1500.00,
  "availableCredit": 3500.00,
  "utilizationPercent": "30.00"
}
```

#### Get Monthly Interest
```http
GET /api/accounts/:id/monthly-interest
```

### Cards

#### List Cards
```http
GET /api/cards?accountId=10000000001&page=1&limit=10
```

#### Get Card by Number
```http
GET /api/cards/:cardNumber
```

#### Create Card (Admin only)
```http
POST /api/cards
Content-Type: application/json

{
  "cardNumber": "4111111111111111",
  "accountId": "10000000001",
  "cardType": "CREDIT",
  "expirationMonth": 12,
  "expirationYear": 2025,
  "cvv": "123"
}
```

#### Update Card (Admin only)
```http
PUT /api/cards/:cardNumber
Content-Type: application/json

{
  "cardStatus": "Y",
  "expirationMonth": 12,
  "expirationYear": 2026
}
```

### Transactions

#### List Transactions
```http
GET /api/transactions?accountId=10000000001&page=1&limit=10
GET /api/transactions?startDate=2024-01-01&endDate=2024-12-31
```

#### Get Transaction by ID
```http
GET /api/transactions/:id
```

#### Create Transaction (Admin only)
```http
POST /api/transactions
Content-Type: application/json

{
  "accountId": "10000000001",
  "cardNumber": "4111111111111111",
  "transactionTypeCode": "03",
  "transactionCategoryCode": "01",
  "transactionSource": "POS",
  "transactionDescription": "Purchase at Store",
  "transactionAmount": 125.50,
  "merchantId": "123456789",
  "merchantName": "Test Merchant",
  "merchantCity": "New York",
  "merchantZip": "10001"
}
```

**Transaction Type Codes:**
- 01: Interest Charge
- 02: Bill Payment
- 03: Purchase
- 04: Cash Advance
- 05: Balance Transfer
- 06: Fee
- 07: Credit
- 08: Refund
- 09: Adjustment
- 10: Other

**Transaction Category Codes:**
- 01: Merchandise
- 02: Bill Payment
- 03: Cash Advance
- 04: Balance Transfer
- 05: Interest Charge
- 06: Late Fee
- 07: Annual Fee
- 08: Service Fee
- 09: Credit Adjustment
- 10: Other

### Authorizations

#### List Authorizations
```http
GET /api/authorizations?cardNumber=4111111111111111&status=APPROVED
```

#### Get Authorization by ID
```http
GET /api/authorizations/:id
```

#### Create Authorization
```http
POST /api/authorizations
Content-Type: application/json

{
  "cardNumber": "4111111111111111",
  "transactionAmount": 500.00,
  "merchantId": "123456789",
  "merchantName": "Test Merchant"
}
```

Response:
```json
{
  "authorization_id": 1,
  "card_number": "4111111111111111",
  "account_id": "10000000001",
  "transaction_amount": 500.00,
  "authorization_status": "APPROVED",
  "decline_reason": null,
  "available_credit": 3500.00,
  "authorization_date": "2024-10-13T10:30:00.000Z"
}
```

#### Purge Expired Authorizations (Admin only)
```http
POST /api/authorizations/purge
Content-Type: application/json

{
  "expiryDays": 30
}
```

### Customers

#### List Customers
```http
GET /api/customers?lastName=Doe&page=1&limit=10
```

#### Get Customer by ID
```http
GET /api/customers/:id
```

#### Create Customer (Admin only)
```http
POST /api/customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "ssn": "123456789",
  "email": "john.doe@example.com",
  "phoneNumber": "8001234567",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "ficoCreditScore": 750
}
```

#### Update Customer (Admin only)
```http
PUT /api/customers/:id
Content-Type: application/json

{
  "email": "newemail@example.com",
  "phoneNumber": "8009876543",
  "ficoCreditScore": 780
}
```

### Users (Admin Only)

#### List Users
```http
GET /api/users?userType=A&page=1&limit=10
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "userId": "USER002",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "password123",
  "userType": "U"
}
```

#### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith-Jones",
  "userType": "A"
}
```

#### Delete User
```http
DELETE /api/users/:id
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Files
- `tests/health.test.js` - Health check endpoint
- `tests/auth.test.js` - Authentication flows
- `tests/accounts.test.js` - Account operations
- `tests/transactions.test.js` - Transaction processing
- `tests/authorizations.test.js` - Authorization logic

## Project Structure

```
Source-code/backend/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── accountController.js
│   ├── cardController.js
│   ├── transactionController.js
│   ├── authorizationController.js
│   ├── customerController.js
│   └── userController.js
├── database/             # Data layer
│   └── memoryStore.js    # In-memory database
├── middleware/           # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Validation middleware
│   └── errorHandler.js   # Error handling
├── routes/               # API routes
│   ├── auth.js
│   ├── accounts.js
│   ├── cards.js
│   ├── transactions.js
│   ├── authorizations.js
│   ├── customers.js
│   └── users.js
├── services/             # Business logic
│   ├── accountService.js
│   ├── cardService.js
│   ├── transactionService.js
│   ├── authorizationService.js
│   ├── customerService.js
│   └── userService.js
├── tests/                # Test suite
│   ├── health.test.js
│   ├── auth.test.js
│   ├── accounts.test.js
│   ├── transactions.test.js
│   └── authorizations.test.js
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── server.js             # Application entry point
└── README.md
```

## Business Logic

### Validation Rules

The backend implements comprehensive validation rules extracted from COBOL:

1. **Required Field Validation**: User ID, password, account ID, card number, transaction amounts, etc.
2. **Format Validation**: Numeric fields, length constraints, pattern matching
3. **Business Rule Validation**: Credit limit checks, account expiration, card status
4. **Cross-Reference Validation**: Account existence, card-account relationship, customer references

### Calculation Rules

1. **Interest Calculation**: Monthly interest based on balance and disclosure group rates
2. **Available Credit Calculation**: Credit limit minus current balance
3. **Balance Updates**: Automatic balance updates on transaction posting
4. **Cycle Tracking**: Current cycle debit and credit accumulation
5. **Transaction ID Generation**: Unique 16-character transaction IDs

### Authorization Logic

The authorization service implements COBOL business logic:

1. **Credit Limit Check**: Decline if transaction amount exceeds available credit
2. **Account Status Check**: Decline if account is inactive
3. **Card Status Check**: Decline if card is inactive
4. **Expiration Check**: Decline if account has expired
5. **Authorization Purging**: Remove authorizations older than configurable days

### Transaction Processing

1. **Pre-Transaction Validation**: Check account status, expiration, and credit limit
2. **Balance Update**: Increase balance for debits, decrease for credits
3. **Cycle Tracking**: Update current cycle debit/credit amounts
4. **Type Classification**: Automatic debit/credit classification based on transaction type

## Development

### Default Credentials

The system initializes with one admin user:
- **User ID**: ADMIN001
- **Password**: admin123
- **Type**: Admin (A)

### Data Initialization

On startup, the system initializes:
- 10 transaction categories (01-10)
- 10 transaction types (01-10)
- 4 disclosure groups (DEFAULT, PREMIUM, STANDARD, INTRO)
- 1 admin user

### Session Management

- Sessions expire after 24 hours
- Session secret should be changed in production
- Sessions are stored in-memory (use Redis for production)

### Error Handling

All errors are caught and returned in a consistent format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden (admin required)
- 404: Not Found
- 409: Conflict (duplicate entry)
- 500: Internal Server Error

### Logging

Request logging is handled by Morgan:
- Development: Colored console output
- Production: Combined format with timestamps

## Angular Frontend Compatibility

This backend is designed to be compatible with Angular frontends:

1. **CORS Enabled**: All origins accepted with credentials support
2. **Consistent Response Format**: All responses follow the same structure
3. **Pagination Support**: Standard page/limit query parameters
4. **Filter Support**: Query parameter filtering on list endpoints
5. **Error Format**: Consistent error response structure
6. **Session-Based Auth**: Compatible with Angular HttpClient's `withCredentials`

### Response Format

List Endpoints:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

Single Item:
```json
{
  "field1": "value1",
  "field2": "value2",
  ...
}
```

## License

ISC

## Support

For issues and questions, please contact the development team or create an issue in the repository.
