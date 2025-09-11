# Backend (Express.js + PostgreSQL)

This is the backend for the migrated COBOL application, implemented with Express.js, Sequelize (ORM), and PostgreSQL.

## Features
- Full CRUD for Customer entity
- Validation & business rules from legacy extraction
- Modular MVC structure
- Robust error handling
- Environment-ready for development & production

## Quick Start

1. Install dependencies:
   npm install
2. Set PostgreSQL credentials in :
   DB_URL=postgres://user:password@localhost:5432/dbname
   PORT=3000
3. Start the backend:
   npm start
4. API endpoints:
   - POST   /api/customers   Create customer
   - GET    /api/customers   List customers
   - GET    /api/customers/:id   Get customer by ID
   - PUT    /api/customers/:id Update customer
   - DELETE /api/customers/:id Remove customer

## Structure

- config/       Sequelize DB config
- models/       ORM models
- validators/   Request validation
- middlewares/  Error & validation handlers
- services/     Business logic
- controllers/  REST handlers
- routes/       API routes

---

Extend with additional entities and features as extracted from COBOL application.
