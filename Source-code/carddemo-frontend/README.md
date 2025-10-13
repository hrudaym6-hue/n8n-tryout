# CardDemo Frontend Application

A comprehensive Angular-based frontend application for the CardDemo project, providing a full-featured credit card management system with account, card, transaction, and authorization management capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Component Overview](#component-overview)
- [Troubleshooting](#troubleshooting)

## Overview

The CardDemo Frontend is a modern, single-page application (SPA) built with Angular 20.3.0. It provides a user-friendly interface for managing credit card accounts, transactions, authorizations, and user administration. The application follows Angular best practices and implements a comprehensive security model with role-based access control.

## Features

### User Features
- **Authentication**: Secure login with JWT token-based authentication
- **Account Management**: View and manage credit card accounts
- **Card Management**: List, search, and view card details
- **Transaction Management**: View transaction history and add new transactions
- **Authorization Tracking**: Monitor authorization requests and status
- **Bill Payment**: Process payments for accounts
- **Reports**: Generate transaction and account reports

### Admin Features
- **User Management**: Full CRUD operations for user administration
- **Account Updates**: Modify account information
- **Card Updates**: Update card details
- **Advanced Access**: Access to all user features plus administrative capabilities

## Technology Stack

- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.7
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading
- **Forms**: Reactive Forms with custom validators
- **State Management**: RxJS for reactive data flows
- **Build Tool**: Angular CLI with esbuild
- **Styling**: CSS3 with component-scoped styles

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 20.3.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Source-code/carddemo-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see [Configuration](#configuration))

## Configuration

### Environment Files

The application uses environment files for configuration:

#### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

#### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

### Backend API Configuration

Update the `apiUrl` in the environment files to point to your backend API endpoint.

## Development

### Development Server

Run the development server:
```bash
npm start
```

Or using Angular CLI:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when source files change.

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name
```

Generate new services:
```bash
ng generate service service-name
```

## Building

### Development Build
```bash
npm run build
```

Or:
```bash
ng build
```

### Production Build
```bash
npm run build -- --configuration production
```

Or:
```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## Testing

### Unit Tests

Run unit tests:
```bash
ng test
```

### End-to-End Tests

Run e2e tests:
```bash
ng e2e
```

### Linting

Run linting (if configured):
```bash
ng lint
```

## Project Structure

```
carddemo-frontend/
├── src/
│   ├── app/
│   │   ├── core/                  # Core module (singleton services, guards, interceptors)
│   │   │   ├── guards/            # Route guards
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/            # Data models
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── account.model.ts
│   │   │   │   ├── card.model.ts
│   │   │   │   ├── transaction.model.ts
│   │   │   │   └── authorization.model.ts
│   │   │   └── services/          # Core services
│   │   │       ├── auth.service.ts
│   │   │       ├── account.service.ts
│   │   │       ├── card.service.ts
│   │   │       ├── transaction.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── authorization.service.ts
│   │   │       ├── bill-payment.service.ts
│   │   │       └── report.service.ts
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   │   └── login/
│   │   │   ├── dashboard/         # Dashboard menus
│   │   │   │   ├── menu/
│   │   │   │   └── admin-menu/
│   │   │   ├── accounts/          # Account management
│   │   │   │   ├── account-list/
│   │   │   │   ├── account-view/
│   │   │   │   └── account-update/
│   │   │   ├── cards/             # Card management
│   │   │   │   ├── card-list/
│   │   │   │   ├── card-search/
│   │   │   │   └── card-update/
│   │   │   ├── transactions/      # Transaction management
│   │   │   │   ├── transaction-list/
│   │   │   │   ├── transaction-detail/
│   │   │   │   └── transaction-add/
│   │   │   ├── users/             # User administration
│   │   │   │   ├── user-list/
│   │   │   │   ├── user-add/
│   │   │   │   ├── user-update/
│   │   │   │   └── user-delete/
│   │   │   ├── authorizations/    # Authorization tracking
│   │   │   │   ├── authorization-list/
│   │   │   │   └── authorization-detail/
│   │   │   ├── bill-payment/      # Bill payment
│   │   │   └── reports/           # Reports
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # Application configuration
│   │   └── app.routes.ts          # Routing configuration
│   ├── environments/              # Environment configurations
│   ├── assets/                    # Static assets
│   ├── styles.css                 # Global styles
│   └── main.ts                    # Application entry point
├── angular.json                   # Angular CLI configuration
├── package.json                   # npm dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## API Integration

### Base URL Configuration

The application connects to a REST API backend. Configure the API URL in environment files:

```typescript
environment.apiUrl = 'http://localhost:3000/api';
```

### API Endpoints

The application integrates with the following API endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

#### Accounts
- `GET /accounts` - List accounts
- `GET /accounts/:id` - Get account details
- `PUT /accounts/:id` - Update account

#### Cards
- `GET /cards` - List cards
- `GET /cards/:id` - Get card details
- `PUT /cards/:id` - Update card
- `GET /cards/search?cardNumber=...` - Search cards

#### Transactions
- `GET /transactions` - List transactions
- `GET /transactions/:id` - Get transaction details
- `POST /transactions` - Add transaction

#### Users (Admin only)
- `GET /users` - List users
- `GET /users/:id` - Get user details
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Authorizations
- `GET /authorizations` - List authorizations
- `GET /authorizations/:id` - Get authorization details

#### Bill Payment
- `POST /bill-payment` - Process payment

#### Reports
- `POST /reports/transactions` - Generate transaction report

### HTTP Interceptor

The application includes an HTTP interceptor that:
- Automatically adds JWT authentication tokens to requests
- Handles global error responses
- Redirects to login on 401 Unauthorized responses

## Authentication & Authorization

### JWT Token Management

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in `localStorage`
- Tokens are automatically included in API requests
- Token expiration triggers automatic logout

### Role-Based Access Control

Two user roles are supported:
- **Regular User (R)**: Access to personal accounts, cards, and transactions
- **Admin User (A)**: Full access including user management and system administration

### Route Guards

- `authGuard`: Protects routes requiring authentication
- `adminGuard`: Protects routes requiring admin privileges

## Component Overview

### Core Components

#### Login Component
- User authentication
- Form validation
- Error handling
- Automatic redirection based on user role

#### Menu Components
- **User Menu**: Dashboard for regular users
- **Admin Menu**: Dashboard for administrators with additional options

### Feature Components

#### Account Management
- **Account List**: Paginated list of accounts with role-based actions
- **Account View**: Detailed account information display
- **Account Update**: Form for updating account details (admin only)

#### Card Management
- **Card List**: Display all cards with pagination
- **Card Search**: Search cards by card number
- **Card Update**: Form for updating card information (admin only)

#### Transaction Management
- **Transaction List**: Paginated transaction history
- **Transaction Detail**: Detailed view of a single transaction
- **Transaction Add**: Form for adding new transactions

#### User Management (Admin Only)
- **User List**: Manage system users with pagination
- **User Add**: Create new users with role assignment
- **User Update**: Edit existing user information
- **User Delete**: Secure user deletion with confirmation

#### Authorization Tracking
- **Authorization List**: View authorization requests
- **Authorization Detail**: Detailed authorization information

#### Additional Features
- **Bill Payment**: Process account payments with confirmation
- **Reports**: Generate and view various reports

## Troubleshooting

### Common Issues

#### API Connection Errors
- Verify the backend API is running
- Check the `apiUrl` in environment files
- Ensure CORS is properly configured on the backend

#### Authentication Issues
- Clear browser localStorage and cookies
- Verify JWT token is being sent in requests
- Check token expiration

#### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear Angular cache: `ng cache clean`
- Verify Node.js and npm versions

#### Runtime Errors
- Check browser console for detailed error messages
- Verify all required services are properly injected
- Ensure route guards are correctly configured

### Development Tips

1. **Use Chrome DevTools**: Monitor network requests and console logs
2. **Angular DevTools**: Install the Angular DevTools extension for debugging
3. **Hot Reload**: The dev server supports hot module replacement
4. **Lazy Loading**: Routes are lazy-loaded for optimal performance

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Documentation](https://angular.dev/cli)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

This project is part of the CardDemo system and follows the organization's licensing terms.

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.
