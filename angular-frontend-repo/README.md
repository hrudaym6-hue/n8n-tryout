# CardDemo Angular Frontend Application

A comprehensive Angular frontend application for the CardDemo Authorization Module, implementing user management, account operations, card management, transaction processing, authorization handling, and reporting capabilities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Components](#components)
- [Services](#services)
- [Guards and Interceptors](#guards-and-interceptors)
- [Environment Configuration](#environment-configuration)
- [Development Guidelines](#development-guidelines)

## Features

### User Management
- Sign-in with authentication
- User list, add, update, and delete operations
- Admin and regular user role management

### Account Operations
- View account details
- Update account information
- Account balance inquiry

### Card Management
- List cards by account
- Update card status and expiration
- Card details view

### Transaction Processing
- Transaction list with search functionality
- Add new transactions
- View transaction details
- Transaction type management

### Authorization
- Authorization summary view
- Authorization detail inspection

### Bill Payment
- Process bill payments
- Payment confirmation

### Reporting
- Generate various report types
- Downloadable reports
- Date range filtering

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Angular CLI (v20.x)

```bash
npm install -g @angular/cli@20
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hrudaym6-hue/n8n-tryout.git
cd n8n-tryout/angular-frontend-repo
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Files

The application uses environment files for configuration:

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

Update these files with your backend API details:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiVersion: 'v1'
};
```

### Backend API Configuration

Ensure your backend API is running and accessible at the configured URL. The frontend expects the following API endpoints:

- `/api/v1/auth` - Authentication
- `/api/v1/users` - User management
- `/api/v1/accounts` - Account operations
- `/api/v1/cards` - Card management
- `/api/v1/transactions` - Transaction processing
- `/api/v1/authorizations` - Authorization handling
- `/api/v1/bill-payments` - Bill payment processing
- `/api/v1/reports` - Report generation

## Running the Application

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Running with Specific Port

```bash
ng serve --port 4300
```

### Running with Production Configuration

```bash
ng serve --configuration production
```

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Run Unit Tests

```bash
ng test
```

### Run End-to-End Tests

```bash
ng e2e
```

### Run Linting

```bash
ng lint
```

## Project Structure

```
angular-frontend-repo/
├── src/
│   ├── app/
│   │   ├── components/          # All Angular components
│   │   │   ├── signin/
│   │   │   ├── main-menu/
│   │   │   ├── admin-menu/
│   │   │   ├── account-view/
│   │   │   ├── account-update/
│   │   │   ├── card-list/
│   │   │   ├── card-update/
│   │   │   ├── transaction-list/
│   │   │   ├── transaction-detail/
│   │   │   ├── transaction-add/
│   │   │   ├── bill-payment/
│   │   │   ├── user-list/
│   │   │   ├── user-add/
│   │   │   ├── user-update/
│   │   │   ├── user-delete/
│   │   │   ├── authorization-summary/
│   │   │   ├── authorization-detail/
│   │   │   ├── report-generation/
│   │   │   ├── transaction-type-list/
│   │   │   └── transaction-type-update/
│   │   ├── guards/              # Route guards
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── models/              # TypeScript models
│   │   │   ├── user.model.ts
│   │   │   ├── account.model.ts
│   │   │   ├── card.model.ts
│   │   │   ├── transaction.model.ts
│   │   │   ├── authorization.model.ts
│   │   │   ├── bill-payment.model.ts
│   │   │   └── report.model.ts
│   │   ├── services/            # Angular services
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── account.service.ts
│   │   │   ├── card.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── authorization.service.ts
│   │   │   ├── bill-payment.service.ts
│   │   │   └── report.service.ts
│   │   ├── shared/              # Shared utilities
│   │   │   └── validators.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/            # Environment configurations
│   ├── assets/                  # Static assets
│   └── styles.scss             # Global styles
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Components

### Authentication
- **SignIn**: User authentication with username and password

### Main Navigation
- **MainMenu**: Main navigation hub for regular users
- **AdminMenu**: Administrative menu for admin users

### Account Management
- **AccountView**: Display account details
- **AccountUpdate**: Update account information

### Card Management
- **CardList**: List all cards for an account
- **CardUpdate**: Update card status and expiration

### Transaction Management
- **TransactionList**: Search and list transactions
- **TransactionDetail**: View detailed transaction information
- **TransactionAdd**: Create new transactions

### User Management (Admin)
- **UserList**: View all users
- **UserAdd**: Create new users
- **UserUpdate**: Update user details
- **UserDelete**: Delete users

### Authorization
- **AuthorizationSummary**: View authorization summary
- **AuthorizationDetail**: View authorization details

### Bill Payment
- **BillPayment**: Process bill payments

### Reporting (Admin)
- **ReportGeneration**: Generate various reports

### Transaction Types (Admin)
- **TransactionTypeList**: Manage transaction types
- **TransactionTypeUpdate**: Update transaction type descriptions

## Services

### AuthService
Handles user authentication, token management, and session control.

### UserService
Manages user CRUD operations and user data.

### AccountService
Handles account operations and account data retrieval.

### CardService
Manages card operations including search and updates.

### TransactionService
Handles transaction operations and transaction type management.

### AuthorizationService
Manages authorization data and operations.

### BillPaymentService
Processes bill payments and retrieves payment information.

### ReportService
Generates and manages various report types.

## Guards and Interceptors

### Guards

#### AuthGuard
- Protects routes requiring authentication
- Redirects unauthenticated users to sign-in page

#### AdminGuard
- Protects admin-only routes
- Checks for admin user type
- Redirects non-admin users to main menu

### Interceptors

#### AuthInterceptor
- Automatically adds JWT token to all HTTP requests
- Handles token refresh if needed

#### ErrorInterceptor
- Centralized error handling
- Provides user-friendly error messages
- Handles authentication errors

## Environment Configuration

### Development (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiVersion: 'v1'
};
```

### Production (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.carddemo.com/api',
  apiVersion: 'v1'
};
```

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement reactive forms for all user inputs
- Use SCSS for styling with BEM methodology

### Form Validation
All forms use custom validators defined in `shared/validators.ts`:
- `numeric()`: Validates numeric input
- `alphanumeric()`: Validates alphanumeric input
- `exactLength(length)`: Validates exact string length
- `dateFormat()`: Validates YYYY-MM-DD date format
- `userType()`: Validates user type (A or R)

### HTTP Communication
- All API calls use services
- Error handling via interceptors
- Type-safe responses using models

### Routing
- Lazy loading for optimal performance
- Route guards for access control
- Query params for data passing

### Security
- JWT token-based authentication
- Secure storage of sensitive data
- No secrets in source code
- HTTPS in production

## API Integration

The frontend integrates with the backend REST API using the following patterns:

### Authentication Flow
1. User submits credentials to `/api/v1/auth/signin`
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in subsequent requests via AuthInterceptor
5. Token validated on protected routes

### Error Handling
- 401: Redirect to sign-in
- 403: Show unauthorized message
- 404: Show not found message
- 500: Show server error message

## Deployment

### Deploy to Development
```bash
ng build
# Deploy dist/ folder to development server
```

### Deploy to Production
```bash
ng build --configuration production
# Deploy dist/ folder to production server
```

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/angular-frontend-repo /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

**Issue**: Module not found errors
```bash
npm install
ng serve
```

**Issue**: API connection refused
- Check backend API is running
- Verify environment configuration
- Check CORS settings on backend

**Issue**: Authentication not working
- Clear browser localStorage
- Check JWT token expiration
- Verify backend authentication endpoint

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run linting: `ng lint`
5. Submit pull request

## License

This project is proprietary software for CardDemo Authorization Module.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Version History

- v1.0.0 - Initial release with core features
  - User authentication
  - Account management
  - Card operations
  - Transaction processing
  - Authorization handling
  - Bill payment
  - Reporting
  - Admin features
