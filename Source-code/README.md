# CardDemo Authorization Module - Backend API

A comprehensive, production-ready Node.js + PostgreSQL backend for a credit card authorization system. This implementation translates complex COBOL business logic into modern RESTful APIs with comprehensive validation rules and business logic.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Business Rules](#business-rules)
- [Validation Rules](#validation-rules)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Authorization System
- **Real-time Authorization Processing**: Process credit card authorization requests with complex business rules
- **Multiple Decline Reasons**: 7 distinct reason codes (3100, 4100, 4200, 4300, 5100, 5200, 9000)
- **Credit Limit Management**: Dynamic available credit calculations
- **Card Validation**: Comprehensive card status and expiry checks
- **Authorization Statistics**: Track approved/declined counts and amounts
- **Automated Purge**: Configurable expiration-based authorization cleanup

### Comprehensive Data Management
- **User Management**: Authentication, authorization, admin/user roles
- **Customer Management**: Full CRUD operations with validation
- **Account Management**: Credit limits, balances, status management
- **Card Management**: Card lifecycle, validation, cross-reference tracking
- **Transaction Management**: Complete transaction history and processing

### Production-Grade Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Comprehensive Logging**: Winston-based logging with file rotation
- **Error Handling**: Centralized error handling with detailed error responses
- **Request Rate Limiting**: Protection against abuse
- **Input Validation**: Joi-based validation on all endpoints
- **Database Connection Pooling**: Optimized PostgreSQL connections
- **Health Checks**: Monitor application and database status

## 🛠 Technology Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: PostgreSQL (v12+)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Performance**: Compression, Rate Limiting

## 🏗 Architecture

```
Source-code/
├── config/              # Configuration files
│   ├── database.js      # PostgreSQL connection pool
│   └── logger.js        # Winston logger configuration
├── models/              # Data models
│   ├── Account.js       # Account model with business logic
│   ├── Card.js          # Card model with validation
│   ├── Customer.js      # Customer model
│   ├── Transaction.js   # Transaction model
│   └── User.js          # User model with authentication
├── services/            # Business logic services
│   └── AuthorizationService.js  # Core authorization processing
├── controllers/         # Request handlers
│   ├── authorizationController.js
│   ├── accountController.js
│   ├── cardController.js
│   ├── customerController.js
│   ├── transactionController.js
│   └── userController.js
├── routes/              # API route definitions
│   ├── authRoutes.js
│   ├── authorizationRoutes.js
│   ├── accountRoutes.js
│   ├── cardRoutes.js
│   ├── customerRoutes.js
│   ├── transactionRoutes.js
│   └── userRoutes.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Centralized error handling
│   └── requestLogger.js # Request logging
├── validators/          # Input validation schemas
│   ├── authorizationValidator.js
│   ├── accountValidator.js
│   ├── cardValidator.js
│   ├── customerValidator.js
│   ├── transactionValidator.js
│   └── userValidator.js
├── utils/               # Utility functions
├── tests/               # Test suites
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── database/            # Database scripts
│   └── schema.sql       # Database schema and seed data
├── logs/                # Application logs
├── server.js            # Application entry point
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 📦 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- PostgreSQL >= 12.0
- Git

## 🚀 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Source-code
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://username:password@localhost:5432/carddemo
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carddemo
DB_USER=your_username
DB_PASSWORD=your_password
DB_POOL_MIN=2
DB_POOL_MAX=10

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

LOG_LEVEL=info

AUTHORIZATION_EXPIRY_DAYS=5

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄 Database Setup

1. **Create the database**:
```bash
createdb carddemo
```

2. **Run the schema**:
```bash
psql -d carddemo -f database/schema.sql
```

This will create:
- All required tables with proper constraints
- Indexes for optimized queries
- Reference data (transaction types, categories, disclosure groups)
- Default admin and test users

### Default Users

After running the schema, two users are available:

**Admin User**:
- User ID: `ADMIN001`
- Password: `admin123`
- Type: Admin

**Regular User**:
- User ID: `USER0001`
- Password: `user123`
- Type: User

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

The server will start on the configured PORT (default: 3000).

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "uptime": 123.456,
  "memory": {
    "rss": 50000000,
    "heapTotal": 30000000,
    "heapUsed": 20000000,
    "external": 1000000
  }
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST /api/auth/login
Login and receive JWT token.

**Request**:
```json
{
  "userId": "USER0001",
  "password": "user123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "USER0001",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "U"
  }
}
```

### Authorization Endpoints

#### POST /api/authorizations
Process a new authorization request.

**Request**:
```json
{
  "accountId": 1234567890,
  "cardNumber": "4111111111111111",
  "transactionAmount": 150.00,
  "merchantId": "123456789",
  "merchantName": "Example Store",
  "merchantCity": "New York",
  "merchantZip": "10001"
}
```

**Response** (Approved):
```json
{
  "auth_id": 1,
  "account_id": 1234567890,
  "card_number": "4111111111111111",
  "transaction_amount": 150.00,
  "merchant_id": "123456789",
  "merchant_name": "Example Store",
  "merchant_city": "New York",
  "merchant_zip": "10001",
  "auth_date": "2024-01-01T12:00:00.000Z",
  "auth_time": "2024-01-01T12:00:00.000Z",
  "response_code": "00",
  "approved_amount": 150.00,
  "reason_code": null,
  "approved": true
}
```

**Response** (Declined):
```json
{
  "auth_id": 2,
  "account_id": 1234567890,
  "card_number": "4111111111111111",
  "transaction_amount": 5000.00,
  "response_code": "05",
  "approved_amount": 0.00,
  "reason_code": "4100",
  "approved": false,
  "declineReasons": ["INSUFFICIENT_FUNDS"]
}
```

#### GET /api/authorizations/account/:accountId
Get authorizations for an account with pagination.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `cardNumber` (optional): Filter by card number

**Response**:
```json
{
  "authorizations": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### POST /api/authorizations/purge
Purge expired authorizations (configurable expiry days).

**Response**:
```json
{
  "deletedCount": 15
}
```

### Account Endpoints

#### GET /api/accounts/:accountId
Get account details.

#### GET /api/accounts/customer/:customerId
Get all accounts for a customer.

#### GET /api/accounts/:accountId/available-credit
Get available credit for an account.

**Response**:
```json
{
  "accountId": 1234567890,
  "availableCredit": 4850.00
}
```

#### POST /api/accounts
Create a new account.

#### PUT /api/accounts/:accountId
Update account details.

### Card Endpoints

#### GET /api/cards/:cardNumber
Get card details.

#### GET /api/cards/account/:accountId
Get all cards for an account.

#### GET /api/cards/customer/:customerId
Get all cards for a customer.

#### GET /api/cards/:cardNumber/validate
Validate a card.

**Response**:
```json
{
  "valid": true,
  "card": {...}
}
```

Or if invalid:
```json
{
  "valid": false,
  "reason": "CARD_NOT_ACTIVE",
  "reasonCode": "4200"
}
```

#### POST /api/cards
Create a new card.

#### PUT /api/cards/:cardNumber
Update card details.

### Customer Endpoints

#### GET /api/customers
Get all customers with pagination.

#### GET /api/customers/:customerId
Get customer details.

#### POST /api/customers
Create a new customer.

#### PUT /api/customers/:customerId
Update customer details.

#### DELETE /api/customers/:customerId
Delete a customer.

### Transaction Endpoints

#### GET /api/transactions/:transactionId
Get transaction details.

#### GET /api/transactions/account/:accountId
Get transactions for an account with pagination and date filtering.

**Query Parameters**:
- `page`, `limit`: Pagination
- `startDate`, `endDate`: Date range filter

#### POST /api/transactions
Create a new transaction.

### User Endpoints

#### GET /api/users (Admin only)
Get all users.

#### GET /api/users/:userId
Get user details.

#### POST /api/users (Admin only)
Create a new user.

#### PUT /api/users/:userId
Update user details.

#### DELETE /api/users/:userId (Admin only)
Delete a user.

## 🎯 Business Rules

### Authorization Decision Rules

The authorization service implements the following COBOL-derived business rules:

1. **Response Codes**:
   - `00`: Approved
   - `05`: Declined

2. **Reason Codes**:
   - `3100`: Card not found in cross-reference
   - `4100`: Insufficient funds
   - `4200`: Card not active or expired
   - `4300`: Account closed
   - `5100`: Card fraud detected
   - `5200`: Merchant fraud detected
   - `9000`: Unknown decline reason

3. **Available Credit Calculation**:
   - Available Credit = Credit Limit - Current Balance
   - Authorization declined if Transaction Amount > Available Credit

4. **Card Validation**:
   - Card must exist
   - Card status must be 'Y' (active)
   - Card must not be expired (based on expiry month/year)

5. **Account Validation**:
   - Account must exist
   - Account status must be 'Y' (active)

6. **Authorization Statistics**:
   - Approved: Increment count, add to approved amount, update credit balance
   - Declined: Increment count, add to declined amount
   - Cash balance reset to 0 on approval

7. **Date/Time Complement Calculation** (COBOL-style):
   - Auth Date Complement: 99999 - YYDDD
   - Auth Time Complement: 999999999 - HHMMSSmmm

8. **Expiration and Purge**:
   - Authorizations older than configured days (default: 5) are eligible for deletion
   - Purge decrements statistics appropriately

## ✅ Validation Rules

All API inputs are validated using Joi schemas. Key validation rules include:

### Authorization
- Account ID: Required, positive integer
- Card Number: Required, exactly 16 digits
- Transaction Amount: Required, positive number, max 999999.99, 2 decimal precision
- Merchant ID: Optional, exactly 9 digits

### Account
- Account Status: Must be 'Y' or 'N'
- Credit Limit: Required, positive number
- All amounts: 2 decimal precision

### Card
- Card Number: Exactly 16 digits
- Expiry Month: 01-12 format
- Expiry Year: 1950-2099 format
- Card Status: 'Y' or 'N'

### Customer
- First Name: 1-25 characters, alphabets and spaces only
- Last Name: 1-25 characters, alphabets and spaces only
- Phone Number: Exactly 10 digits
- FICO Score: 300-850 range

### Transaction
- Transaction Type/Category: Exactly 2 numeric digits
- Amount Format: Sign + 8 digits + decimal + 2 digits
- Dates: ISO format (YYYY-MM-DD)

### User
- User ID: Max 8 characters, required
- Password: Min 6 characters
- User Type: 'U' (User) or 'A' (Admin)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode
npm run test:watch
```

## 🚢 Deployment

### Environment Variables for Production

Ensure the following are set in production:

```env
NODE_ENV=production
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-random-secret>
LOG_LEVEL=warn
```

### Database Migration

Run the schema on your production database:
```bash
psql -d <production-db> -f database/schema.sql
```

### Process Management

Use PM2 or similar for production:
```bash
npm install -g pm2
pm2 start server.js --name carddemo-backend
pm2 save
pm2 startup
```

## 🔒 Security

- **JWT Tokens**: Secure, expiring tokens for authentication
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Prevent abuse
- **Helmet**: Security headers
- **Input Validation**: All inputs validated before processing
- **Error Handling**: No sensitive information in error messages
- **Logging**: Security events logged

### Security Best Practices

1. Never commit `.env` files
2. Use strong JWT secrets (min 32 characters)
3. Rotate JWT secrets periodically
4. Use HTTPS in production
5. Keep dependencies updated
6. Monitor logs for suspicious activity
7. Implement IP whitelisting if needed
8. Use database connection encryption

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to database

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string in `.env`
3. Verify database exists: `psql -l`
4. Check firewall settings

### Authentication Errors

**Problem**: JWT authentication fails

**Solution**:
1. Verify JWT_SECRET is set
2. Check token expiration
3. Ensure Authorization header format: `Bearer <token>`

### Validation Errors

**Problem**: API returns validation errors

**Solution**:
1. Check request body matches schema
2. Verify data types and formats
3. Review API documentation for required fields

### Performance Issues

**Problem**: Slow API responses

**Solution**:
1. Check database indexes
2. Monitor connection pool
3. Review query execution plans
4. Enable query logging
5. Check application logs

## 📝 License

ISC

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for CardDemo Authorization System**
