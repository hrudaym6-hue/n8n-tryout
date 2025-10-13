const request = require('supertest');
const app = require('../server');
const { users } = require('../database/memoryStore');

describe('Authentication', () => {
    beforeEach(() => {
        for (const key of users.keys()) {
            if (key !== 'ADMIN001') {
                users.delete(key);
            }
        }
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user successfully', async () => {
            const userData = {
                userId: 'TEST001',
                firstName: 'Test',
                lastName: 'User',
                password: 'password123',
                userType: 'U'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.user).toHaveProperty('userId', 'TEST001');
            expect(response.body.user).toHaveProperty('userType', 'U');
        });

        test('should fail if user ID already exists', async () => {
            const userData = {
                userId: 'ADMIN001',
                firstName: 'Admin',
                lastName: 'User',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe('User ID already exists');
        });

        test('should fail if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ userId: 'TEST001' })
                .expect(400);

            expect(response.body.error).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ userId: 'ADMIN001', password: 'admin123' })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.message).toBe('Login successful');
            expect(response.body.user).toHaveProperty('userId', 'ADMIN001');
        });

        test('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ userId: 'ADMIN001', password: 'wrongpassword' })
                .expect(401);

            expect(response.body.error).toBe('Invalid user ID or password');
        });

        test('should fail with non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ userId: 'NONEXIST', password: 'password' })
                .expect(401);

            expect(response.body.error).toBe('Invalid user ID or password');
        });
    });

    describe('POST /api/auth/logout', () => {
        test('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .expect(200);

            expect(response.body.message).toBe('Logged out successfully');
        });
    });
});
