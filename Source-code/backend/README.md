# CardDemo Backend

Production-ready Node.js + Express + PostgreSQL backend for the CardDemo credit card authorization system. This backend implements comprehensive business rules and validation logic extracted from COBOL programs.

## Features

- **RESTful API** with full CRUD operations
- **JWT Authentication** with role-based access control (Admin/User)
- **Comprehensive Validation** implementing 882+ validation rules from COBOL
- **Complex Business Logic** for authorization decisions and transaction processing
- **PostgreSQL Database** with proper indexing and constraints
- **Production-grade Error Handling** and logging
- **Security Best Practices** with bcrypt password hashing and JWT tokens

## Prerequisites

- Node.js 16.x or higher
- PostgreSQL 12.x or higher
- npm or yarn

## Installation

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

5. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/carddemo
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=24h
LOG_LEVEL=info
```

## Running the Application

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

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  - Request: `{ "userId": "string", "password": "string" }`
  - Response: `{ "token": "jwt-token", "user": {...} }`

- `GET /api/auth/verify` - Verify JWT token (requires auth)
  - Response: `{ "valid": true, "user": {...} }`

### Users (Admin only)
- `GET /api/users` - List all users (paginated)
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create new user
  - Request: `{ "userId": "string", "firstName": "string", "lastName": "string", "password": "string", "userType": "U|A" }`
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Accounts
- `GET /api/accounts` - List accounts (paginated, filterable)
  - Query params: `page`, `limit`, `accountId`, `customerId`, `accountStatus`
- `GET /api/accounts/:id` - Get account by ID
- `PUT /api/accounts/:id` - Update account
  - Request: `{ "accountStatus": "Y|N", "creditLimit": number, "cashCreditLimit": number }`
- `GET /api/accounts/:id/credit` - Get available credit information

### Cards
- `GET /api/cards` - List cards (paginated, filterable)
  - Query params: `page`, `limit`, `cardNumber`, `accountId`, `customerId`, `cardStatus`
- `GET /api/cards/:cardNumber` - Get card by number
- `PUT /api/cards/:cardNumber` - Update card
  - Request: `{ "cardStatus": "Y|N", "expiryMonth": "string", "expiryYear": "string" }`

### Transactions
- `GET /api/transactions` - List transactions (paginated, filterable)
  - Query params: `page`, `limit`, `accountId`, `cardNumber`, `startDate`, `endDate`
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
  - Request: `{ "accountId": "string", "cardNumber": "string", "transactionTypeCode": "string", "transactionCategoryCode": "string", "transactionAmount": number, "merchantId": "string", "merchantName": "string", ... }`

### Authorizations
- `POST /api/authorizations` - Process authorization request
  - Request: `{ "accountId": "string", "cardNumber": "string", "transactionAmount": number, "merchantId": "string", "merchantName": "string", "merchantCity": "string", "merchantZip": "string" }`
  - Response codes:
    - `00` - Approved
    - `04` - Card not active
    - `05` - Account not active
    - `14` - Invalid account/card
    - `51` - Insufficient credit
    - `61` - Exceeds credit limit
- `GET /api/authorizations/account/:accountId` - Get authorizations by account (paginated)
- `GET /api/authorizations/:id` - Get authorization by ID

### Customers
- `GET /api/customers` - List customers (paginated)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
  - Request: `{ "customerId": number, "firstName": "string", "lastName": "string", "dateOfBirth": "YYYY-MM-DD", "phoneNumber": "string", "ssn": "string", "email": "string", ... }`
- `PUT /api/customers/:id` - Update customer

### Health Check
- `GET /api/health` - Server health status
  - Response: `{ "status": "healthy", "timestamp": "ISO date", "environment": "development" }`

## Validation Rules

The backend implements comprehensive validation rules including:

- **Phone Numbers**: Must be 10 digits with valid area codes
- **SSN**: Must be exactly 9 digits
- **FICO Score**: Must be between 300 and 850
- **Card Numbers**: Must be exactly 16 digits
- **Account IDs**: Must be exactly 11 digits
- **Transaction Amounts**: Positive numbers with max 10 digits and 2 decimals
- **Merchant IDs**: Must be exactly 9 digits
- **User Types**: Must be 'U' (User) or 'A' (Admin)
- **Status Fields**: Must be 'Y' (Active) or 'N' (Inactive)

## Business Logic

### Authorization Processing
The authorization service implements complex business logic including:
- Account status verification
- Card status verification
- Credit limit checks
- Available credit calculations
- Authorization approval/decline decisions with response codes
- Automatic account balance updates on approval

### Transaction Processing
- Automatic transaction ID generation
- Account and card validation
- Account balance updates based on transaction type
- Support for debit (purchases, cash advance) and credit (payments, refunds) transactions

## Database Schema

The database includes the following tables:
- `users` - System users with authentication
- `customers` - Customer personal information
- `accounts` - Credit card accounts with balances and limits
- `cards` - Credit cards linked to accounts
- `transactions` - Transaction history
- `authorizations` - Authorization requests and responses
- `transaction_types` - Transaction type codes
- `transaction_categories` - Transaction category codes
- `disclosure_groups` - Interest rate groups
- `card_xref` - Card to account cross-reference

## Security

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens are used for authentication
- Role-based access control (Admin/User)
- Environment variables for sensitive configuration
- SQL injection prevention through parameterized queries
- CORS enabled for cross-origin requests

## Error Handling

The backend provides comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Resource not found (404)
- Duplicate entries (409)
- Database constraint violations
- Internal server errors (500)

All errors return JSON with descriptive error messages.

## Logging

- Morgan HTTP request logging
- Console logging for errors and important events
- Configurable log level through environment variables

## Testing

The backend includes a test suite using Jest and Supertest. Run tests with:
```bash
npm test
```

Test coverage report:
```bash
npm test -- --coverage
```

## Development

### Adding New Endpoints
1. Create service in `services/`
2. Create controller in `controllers/`
3. Create route in `routes/`
4. Add route to `server.js`
5. Add validation middleware if needed
6. Write tests in `tests/`

### Database Migrations
To modify the database schema:
1. Update `database/schema.sql`
2. Create migration script if needed
3. Document changes in this README

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Enable database SSL
4. Configure proper CORS origins
5. Set up process manager (PM2)
6. Enable HTTPS
7. Configure database connection pooling
8. Set up logging and monitoring

## License

ISC

## Support

For issues and questions, please contact the development team.
