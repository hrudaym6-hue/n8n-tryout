# cart-demo Angular Frontend

Angular frontend application for the cart-demo Authorization Module, built based on user stories and validation rules extracted from COBOL mainframe programs.

## Overview

This application implements the cart-demo system's user interface using Angular 20.3.4, providing a modern web interface for mainframe COBOL business processes including user authentication, account management, credit card operations, and administrative functions.

## Features

- **User Authentication**: Secure login with JWT token-based authentication
- **Role-Based Access Control**: Different interfaces for regular users and administrators
- **Account Management**: View and manage customer accounts
- **Credit Card Operations**: Card management and transaction viewing
- **Bill Payment**: Payment processing interface
- **Administrative Functions**: User management and system administration
- **Responsive Design**: Mobile-friendly interface

## Architecture

### Core Services

- **AuthService**: Manages user authentication and session state
- **AccountService**: Handles account data operations
- **CardService**: Manages credit card operations
- **TransactionService**: Transaction data management
- **UserService**: User profile and management
- **AuthorizationService**: Validation and authorization rules

### Guards

- **AuthGuard**: Protects routes requiring authentication
- **AdminGuard**: Restricts access to administrative functions

### Interceptors

- **AuthInterceptor**: Automatically adds JWT tokens to HTTP requests

### Components

#### Authentication
- **LoginComponent**: User sign-on screen (COSGN00C)

#### Dashboard
- **MenuComponent**: Main menu for regular users (COMEN01C)
- **AdminMenuComponent**: Administrative menu for admin users

#### Feature Modules
- **AccountListComponent**: Display and manage accounts
- Additional components for cards, transactions, and reports

## Technology Stack

- **Framework**: Angular 20.3.4
- **Language**: TypeScript
- **Forms**: Reactive Forms with custom validators
- **HTTP**: HttpClient with interceptors
- **Routing**: Angular Router with guards
- **Testing**: Jasmine & Karma
- **Build**: Angular CLI

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20.3.4)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hrudaym6-hue/n8n-tryout.git
cd n8n-tryout/Source-code/carddemo-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
Update `src/environments/environment.ts` with your backend API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Development

### Start Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
# or
ng test
```

### Code Linting

```bash
npm run lint
# or
ng lint
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/          # Core business services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   ├── features/
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard and menu components
│   │   ├── accounts/          # Account management
│   │   ├── cards/             # Credit card operations
│   │   ├── transactions/      # Transaction views
│   │   └── admin/             # Administrative functions
│   ├── app-routing-module.ts  # Application routing
│   └── app-module.ts          # Root module
├── environments/              # Environment configurations
└── assets/                    # Static assets
```

## User Stories Implementation

The application implements user stories extracted from COBOL programs:

### US-COSGN00C-001: User Sign-On
- Route: `/login`
- Component: `LoginComponent`
- Validations:
  - User ID required (max 8 characters)
  - Password required (max 8 characters)
  - Credential validation against USRSEC file
  - Role-based redirection (admin vs regular user)

### US-COMEN01C-001: Main Menu Navigation
- Route: `/dashboard`
- Component: `MenuComponent`
- Features:
  - Account management
  - Credit card operations
  - Bill payment
  - Transaction viewing
  - Report generation
  - User sign-off

### US-COADM01C-001: Administrative Menu
- Route: `/admin/menu`
- Component: `AdminMenuComponent`
- Features:
  - User management
  - System administration
  - Report access
  - Administrative sign-off

### US-COACTVW-001: Account List View
- Route: `/accounts`
- Component: `AccountListComponent`
- Features:
  - Display account details
  - Account filtering and search
  - Navigation to account details

## API Integration

The frontend connects to a RESTful backend API with the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/accounts` - List accounts
- `GET /api/accounts/:id` - Get account details
- `GET /api/cards` - List credit cards
- `GET /api/transactions` - List transactions
- Additional endpoints for other operations

## Environment Configuration

### Development Environment
File: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production Environment
File: `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials against USRSEC file
4. On success, backend returns JWT token and user details
5. Frontend stores token in localStorage
6. AuthInterceptor adds token to subsequent requests
7. Guards protect routes based on authentication status and user role

## Validation Rules

Form validations implement business rules from COBOL programs:

- **Empty Field Validation**: All required fields must be filled
- **Field Length Validation**: Maximum lengths enforced
- **Format Validation**: Specific formats for account numbers, card numbers, etc.
- **Business Logic Validation**: Custom validators for business rules

## Security

- JWT token-based authentication
- HTTP-only cookies option available
- Role-based access control (RBAC)
- Route guards prevent unauthorized access
- Secure password handling (never stored in frontend)
- HTTPS required in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4201
```

### API Connection Issues
Check that:
1. Backend server is running
2. CORS is properly configured on backend
3. API URL in environment file is correct

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

This project is part of the cart-demo modernization initiative.

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
