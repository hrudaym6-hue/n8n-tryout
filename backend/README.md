# Backend (Express.js + PostgreSQL)

## Features
- Secure REST API for Customer management, login, dashboard, and reporting.
- Production-ready Express.js structure: modular, scalable, uses Sequelize ORM.
- Validation and business rules enforced from extracted schema files.

## Getting Started

1. **Install dependencies**
    cd backend
    npm install
2. **Set **
    DB_URL=postgres://username:password@localhost:5432/dbname
    PORT=3000
3. **Start the server**
    npm start
4. **API Endpoints**
    - /api/customers: CRUD for customers
    - /api/auth/login: (To be implemented if needed)

## Project Structure
- models/ - Data models
- controllers/ - API endpoints
- services/ - Business logic
- routes/ - Route definitions
- validators/ - Schema validation
- middlewares/ - Error handling and request validation

## License
MIT

