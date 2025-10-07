# CardDemo Angular Frontend

This is the Angular frontend for the CardDemo Authorization Module, a modernized web interface for a COBOL mainframe credit card management system.

## Overview

The CardDemo application provides comprehensive credit card account management functionality including:
- User authentication and authorization
- Account management and viewing
- Credit card operations
- Transaction processing and tracking
- Bill payment functionality
- Authorization management
- Reporting capabilities
- User administration (admin only)

## Architecture

### Technology Stack
- **Framework**: Angular 20.3.0
- **Styling**: SCSS
- **Package Manager**: npm
- **Build Tool**: Angular CLI with esbuild

### Project Structure
```
src/
├── app/
│   ├── components/          # UI components
│   │   ├── signin/         # User sign-in (COSGN)
│   │   ├── main-menu/      # Main menu (COMEN)
│   │   ├── admin-menu/     # Admin menu (COADM)
│   │   ├── account-view/   # Account details view
│   │   ├── account-update/ # Update account limits
│   │   ├── card-list/      # Credit card listing
│   │   ├── card-update/    # Update card details
│   │   ├── transaction-list/     # Transaction listing
│   │   ├── transaction-detail/   # Transaction details
│   │   ├── transaction-add/      # Add new transaction
│   │   ├── authorization-summary/ # Authorization summary
│   │   ├── authorization-detail/  # Authorization details
│   │   ├── bill-payment/   # Bill payment functionality
│   │   ├── report-generation/ # Report generation
│   │   ├── user-list/      # User administration
│   │   ├── user-add/       # Add new user
│   │   ├── user-update/    # Update user details
│   │   ├── user-delete/    # Delete user
│   │   └── transaction-type-list/   # Transaction type maintenance
│   │       └── transaction-type-update/ # Update transaction types
│   ├── models/             # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── account.model.ts
│   │   ├── card.model.ts
│   │   ├── transaction.model.ts
│   │   ├── authorization.model.ts
│   │   ├── transaction-type.model.ts
│   │   └── report.model.ts
│   ├── services/           # API service layer
│   │   ├── auth.service.ts
│   │   ├── account.service.ts
│   │   ├── card.service.ts
│   │   ├── transaction.service.ts
│   │   ├── authorization.service.ts
│   │   ├── user.service.ts
│   │   ├── bill-pay.service.ts
│   │   ├── transaction-type.service.ts
│   │   └── report.service.ts
│   ├── guards/             # Route guards
│   │   ├── auth.guard.ts   # Authentication guard
│   │   └── admin.guard.ts  # Admin authorization guard
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts  # Auth token & error handling
│   └── app.routes.ts       # Application routing
├── environments/           # Environment configurations
│   ├── environment.ts      # Development environment
│   └── environment.prod.ts # Production environment
└── styles.scss            # Global styles
```

## Features

### Authentication & Authorization
- Secure user sign-in with JWT token-based authentication
- Role-based access control (Regular users vs. Administrators)
- Route guards to protect unauthorized access
- HTTP interceptor for automatic token injection and error handling

### Account Management
- View detailed account information including balances and limits
- Update credit limits and cash credit limits
- View associated customer information

### Credit Card Operations
- List all cards for an account
- View card details and current balances
- Update card status and expiration dates

### Transaction Management
- Browse transaction history with pagination
- View detailed transaction information
- Add new transactions
- Filter transactions by criteria

### Authorization Management (Admin)
- View authorization summaries
- Review authorization details
- Toggle fraud flags for suspicious transactions

### Bill Payment
- Process bill payments
- Track payment history

### User Administration (Admin Only)
- List all system users
- Add new users with appropriate roles
- Update user information
- Delete users from the system

### Transaction Type Maintenance (Admin)
- Manage transaction type codes
- Update transaction type descriptions
- Search and filter transaction types

### Reporting
- Generate various account and transaction reports
- Export reports in multiple formats

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Navigate to the frontend directory:
```bash
cd Source-code/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Update `src/environments/environment.ts` for development
   - Update `src/environments/environment.prod.ts` for production
   - Set the `apiUrl` to point to your backend API endpoint

Example environment configuration:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Update with your backend URL
};
```

### Development Server

Run the development server:
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to the source files.

### Building for Production

Build the project for production:
```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute unit tests:
```bash
npm test
# or
ng test
```

Run tests in headless mode (CI):
```bash
ng test --browsers=ChromeHeadless --watch=false
```

## Configuration

### Environment Variables

The application uses Angular environment files for configuration:

**Development (`environment.ts`):**
- `production`: false
- `apiUrl`: Backend API base URL for development (default: http://localhost:3000/api)

**Production (`environment.prod.ts`):**
- `production`: true
- `apiUrl`: Backend API base URL for production

### Backend API Integration

All services communicate with the backend REST API. Ensure the backend is running and accessible at the configured `apiUrl`.

API endpoints expected by the frontend:
- `/api/auth/login` - User authentication
- `/api/accounts/*` - Account operations
- `/api/cards/*` - Card operations
- `/api/transactions/*` - Transaction operations
- `/api/authorizations/*` - Authorization operations
- `/api/users/*` - User management (admin)
- `/api/bill-payments/*` - Bill payment operations
- `/api/transaction-types/*` - Transaction type management (admin)
- `/api/reports/*` - Report generation

## User Roles

### Regular User (R)
- Sign in/out
- View account information
- Manage credit cards
- View transactions
- Make bill payments
- Generate reports

### Administrator (A)
- All regular user capabilities
- User management (add, update, delete users)
- Authorization management
- Transaction type maintenance
- Access to admin-only features

## User Stories Implementation

This frontend implements user stories from the CardDemo COBOL system:

1. **COSGN** - Sign-on screen with user authentication
2. **COMEN** - Main menu for regular users
3. **COADM** - Admin menu for administrators
4. **Account Management** - View and update account details
5. **Credit Card Management** - List and manage credit cards
6. **Transaction Management** - View, add, and manage transactions
7. **Bill Payment** - Process bill payments
8. **Authorization Management** - Review and manage authorizations
9. **User Administration** - Manage system users (admin only)
10. **Transaction Type Maintenance** - Manage transaction types (admin only)
11. **Reporting** - Generate various reports

## Security Features

- JWT token-based authentication
- HTTP-only cookie support (if configured on backend)
- Route guards for authentication and authorization
- Global HTTP interceptor for error handling
- Automatic token injection in API requests
- Role-based access control

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

**Issue: Cannot connect to backend API**
- Verify the backend is running at the configured URL
- Check `apiUrl` in environment configuration
- Verify CORS settings on backend allow frontend origin

**Issue: Authentication fails**
- Clear browser cache and cookies
- Verify backend authentication endpoint is working
- Check network tab for detailed error messages

**Issue: Route guards redirect to signin**
- Ensure you are logged in
- Verify JWT token is not expired
- Check browser console for authentication errors

**Issue: Admin features not accessible**
- Verify user has admin role (userType: 'A')
- Check route guard configuration
- Ensure admin.guard.ts is properly applied to admin routes

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement reactive forms for all user inputs
- Use standalone components (Angular 14+ pattern)
- Inject dependencies using `inject()` function

### Component Structure
- Each component has `.ts`, `.html`, and `.scss` files
- Use reactive forms with proper validation
- Implement error handling and loading states
- Follow consistent naming conventions

### Service Layer
- All backend communication through services
- Return Observables for async operations
- Implement proper error handling
- Use TypeScript interfaces for type safety

## Contributing

When contributing to this project:
1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Build for production to verify no errors
5. Submit a pull request

## Version History

- **v1.0.0** - Initial Angular frontend implementation
  - All core components implemented
  - Authentication and authorization
  - Routing with guards
  - HTTP interceptors
  - Reactive forms with validations
  - Complete service layer for backend integration

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
