# CardDemo Backend - Production-Ready Node.js + PostgreSQL API

A comprehensive backend implementation for the CardDemo credit card authorization system, translated from COBOL to modern Node.js/Express architecture. This backend implements all validation rules, business logic, and authorization workflows specified in the original COBOL system.

## 🏗️ Architecture Overview

This backend is built using:
- **Node.js + Express.js** for RESTful API endpoints
- **PostgreSQL** for relational data storage
- **JWT** for authentication and authorization
- **Joi** for request validation
- **bcrypt** for password hashing
- **Jest + Supertest** for testing

## 📁 Project Structure

```
Source-code/backend/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── database/
│   ├── schema.sql           # Complete database schema with indexes
│   └── init.js              # Database initialization script
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Request validation middleware
├── models/                  # (Future: Sequelize/TypeORM models)
├── routes/
│   ├── auth.routes.js       # Authentication endpoints
│   ├── user.routes.js       # User management endpoints
│   ├── customer.routes.js   # Customer management endpoints
│   ├── account.routes.js    # Account management endpoints
│   ├── card.routes.js       # Card management endpoints
│   ├── transaction.routes.js # Transaction endpoints
│   └── authorization.routes.js # Authorization processing endpoints
├── services/
│   ├── auth.service.js      # Authentication business logic
│   ├── user.service.js      # User management business logic
│   ├── customer.service.js  # Customer business logic
│   ├── account.service.js   # Account business logic
│   ├── card.service.js      # Card business logic
│   ├── transaction.service.js # Transaction processing logic
│   └── authorization.service.js # Complex authorization logic
├── validators/
│   ├── auth.validator.js    # Login validation schemas
│   ├── user.validator.js    # User validation schemas
│   ├── customer.validator.js # Customer validation (SSN, phone, FICO)
│   ├── account.validator.js # Account validation schemas
│   ├── card.validator.js    # Card validation (expiry, status)
│   ├── transaction.validator.js # Transaction validation
│   └── authorization.validator.js # Authorization validation
├── tests/                   # Unit and integration tests
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main application entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Source-code/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb carddemo
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE carddemo;
   \q
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update with your credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   
   DATABASE_URL=postgresql://username:password@localhost:5432/carddemo
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=carddemo
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRATION=24h
   
   LOG_LEVEL=info
   ```

5. **Initialize database schema**
   ```bash
   npm run db:init
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints except `/api/auth/login` and `/api/health` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### 🔐 Authentication
- `POST /api/auth/login` - User login (returns JWT token)

#### 👤 Users (Admin only for create/update/delete)
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

#### 👥 Customers
- `GET /api/customers` - Get all customers (paginated)
- `GET /api/customers/:customerId` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:customerId` - Update customer
- `DELETE /api/customers/:customerId` - Delete customer

#### 💳 Accounts
- `GET /api/accounts` - Get all accounts (paginated)
- `GET /api/accounts/:accountId` - Get account by ID
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:accountId` - Update account
- `DELETE /api/accounts/:accountId` - Delete account

#### 🎴 Cards
- `GET /api/cards` - Get all cards (paginated, filterable)
- `GET /api/cards/:cardNumber` - Get card by number
- `POST /api/cards` - Create new card
- `PUT /api/cards/:cardNumber` - Update card
- `DELETE /api/cards/:cardNumber` - Delete card

#### 💸 Transactions
- `GET /api/transactions` - Get all transactions (paginated, filterable)
- `GET /api/transactions/types` - Get transaction types
- `GET /api/transactions/categories` - Get transaction categories
- `GET /api/transactions/:transactionId` - Get transaction by ID
- `POST /api/transactions` - Create new transaction

#### ✅ Authorizations
- `GET /api/authorizations` - Get all authorizations (paginated, filterable)
- `GET /api/authorizations/:authId` - Get authorization by ID
- `POST /api/authorizations` - Process new authorization
- `DELETE /api/authorizations/:authId` - Delete authorization

#### 🏥 Health Check
- `GET /api/health` - Health check endpoint (no auth required)

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER0001",
    "password": "password123"
  }'
```

Response:
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

#### Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1990-05-15",
    "phoneNumber": "2025551234",
    "email": "jane.smith@example.com",
    "addressLine1": "123 Main St",
    "city": "Washington",
    "state": "DC",
    "zipCode": "20001",
    "ssn": "123456789",
    "ficoScore": 750
  }'
```

#### Process Authorization
```bash
curl -X POST http://localhost:3000/api/authorizations \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "cardNumber": "1234567890123456",
    "transactionAmount": 150.00,
    "merchantId": "MERCH001",
    "merchantName": "Sample Store",
    "merchantCity": "New York",
    "merchantZip": "10001"
  }'
```

## 🔒 Validation Rules

This backend implements comprehensive validation rules translated from COBOL:

### User Validation
- User ID: Required, max 8 characters
- Password: Required, securely hashed with bcrypt
- User Type: Must be 'U' (User) or 'A' (Admin)
- First/Last Name: Required, max 25 characters

### Customer Validation
- First/Last Name: Required, alphabetic characters and spaces only
- Phone Number: Exactly 10 digits with valid North American area code
- SSN: Exactly 9 digits, cannot be all zeros
- FICO Score: Numeric, 0-850 range
- Email: Valid email format

### Account Validation
- Account ID: 11-digit numeric
- Credit Limit: Required, numeric, non-negative
- Account Status: Must be 'Y' or 'N'
- Customer must exist in database

### Card Validation
- Card Number: 16-digit numeric (auto-generated)
- Embossed Name: Required, alphabetic characters and spaces only
- Card Status: Must be 'Y' or 'N'
- Expiry Month: 1-12
- Expiry Year: 4-digit year
- Account and Customer must exist

### Transaction Validation
- Transaction ID: 16-digit numeric (auto-generated)
- Transaction Amount: Required, numeric, non-negative
- Card and Account must exist and be valid

## 🧪 Authorization Business Logic

The authorization service implements complex business rules from the COBOL system:

### Authorization Response Codes
- `00` - Approved
- `10` - Partial approval (insufficient credit)
- `51` - Declined - Insufficient funds
- `54` - Declined - Expired card
- `05` - Declined - Invalid account/card/status

### Authorization Process
1. Validate account exists and is active
2. Validate card exists, is active, and not expired
3. Check available credit against transaction amount
4. If sufficient credit: Approve full amount
5. If partial credit available: Approve partial amount
6. If insufficient credit: Decline transaction
7. Update account balance for approved/partial authorizations

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication with configurable expiration
- Role-based access control (User vs Admin)
- SQL injection prevention through parameterized queries
- Input validation on all endpoints
- CORS enabled for cross-origin requests
- Comprehensive error handling without exposing sensitive information

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/carddemo
JWT_SECRET=<strong-random-secret>
JWT_EXPIRATION=24h
LOG_LEVEL=error
```

### Running in Production
```bash
NODE_ENV=production npm start
```

## 📊 Database Schema

The database includes the following tables:
- `users` - System users (authentication)
- `customers` - Customer personal information
- `accounts` - Credit card accounts
- `cards` - Physical/virtual cards
- `transactions` - Transaction history
- `authorizations` - Authorization records
- `transaction_types` - Transaction type reference
- `transaction_categories` - Transaction category reference
- `disclosure_groups` - Interest rate groups
- `card_xref` - Card-account cross-reference

All tables include proper:
- Primary and foreign key constraints
- Indexes for performance
- Timestamps (created_at, updated_at)
- Cascading deletes where appropriate

## 🔄 COBOL to Node.js Translation

This backend translates complex COBOL business logic into modern Node.js:

### Key Translations
1. **COBOL File I/O** → PostgreSQL database with parameterized queries
2. **COBOL Validation Rules** → Joi validation schemas
3. **COBOL Business Rules** → Service layer methods
4. **COBOL Error Handling** → Express error middleware
5. **COBOL Data Structures** → JSON request/response objects

### Preserved Business Logic
- All field-level and entity-level validations
- Authorization decision rules and response codes
- Transaction processing workflows
- Account balance management
- Credit limit checks

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d carddemo
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Check token expiration time
- Verify Authorization header format: `Bearer <token>`

## 📞 Support

For issues or questions, please refer to the repository issue tracker.

## 📄 License

ISC

## 🙏 Acknowledgments

This backend was built as part of a COBOL-to-modern-stack migration project, preserving all business logic and validation rules from the original system while adopting modern architecture and best practices.
