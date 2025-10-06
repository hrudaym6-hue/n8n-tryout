# Angular Frontend for User/Account/Order/Transaction Management

## Overview
Production-ready Angular frontend architected for the following backend API endpoints:
- POST /api/users (Register)
- POST /api/users/login (Login)
- POST /api/accounts (Create Account)
- POST /api/orders (Create Order)
- POST /api/transactions (Create Transaction)

## Folder Structure
- src/app/core/
  - api.service.ts
  - auth.service.ts
  - auth.interceptor.ts
  - core.module.ts
- src/app/shared/
  - error-message/
    - error-message.component.ts|html|css
  - shared.module.ts
- src/app/features/user/
  - register/
    - register.component.ts|html|css
  - login/
    - login.component.ts|html|css
  - user.module.ts
- src/app/features/account/
  - create-account/
    - create-account.component.ts|html|css
  - account.module.ts
- src/app/features/order/
  - create-order/
    - create-order.component.ts|html|css
  - order.module.ts
- src/app/features/transaction/
  - create-transaction/
    - create-transaction.component.ts|html|css
  - transaction.module.ts
- src/app/app.module.ts
- src/app/app-routing.module.ts
- src/assets/
- src/environments/
  - environment.ts (API base URL)
  - environment.prod.ts

## Pages/Modules
- Register: Form for creating user (username, password, [email]) with validation (required, password strength).
- Login: Form for user authentication; stores JWT securely.
- Create Account: Form with fields (user_id, account_number), validates required, alphanumeric.
- Create Order: Form (user_id, amount, backordered), amount>0.
- Create Transaction: Form (account_id, type=[deposit,withdrawal,transfer], amount [1-10000]), all validated.

## Validation
- All forms use Angular ReactiveForms.
- Password: min 8 chars, uppercase, lowercase, number, symbol.
- Amount: positive numbers per rules.
- Type: select/enum validation.
- Required fields on all forms.

## Auth & Security
- JWT securely saved (localStorage/sessionStorage).
- AuthInterceptor attaches JWT to all outgoing requests.
- Proper error message handling.

## How to Start
- Install dependencies: `npm install`
- Start: `ng serve`
- Back end must be running and API URL set in environment.ts
