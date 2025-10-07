const request = require('supertest');
const app = require('../../server');

describe('Authentication Integration Tests', () => {
    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    userId: 'USER0001',
                    password: 'user123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.userId).toBe('USER0001');
        });

        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    userId: 'USER0001',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject missing userId', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'user123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    userId: 'USER0001'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});
