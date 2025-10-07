const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
    describe('POST /api/auth/login', () => {
        it('should return 400 if userId is missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ password: 'test123' });
            
            expect(response.status).toBe(400);
        });

        it('should return 400 if password is missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ userId: 'USER0001' });
            
            expect(response.status).toBe(400);
        });
    });
});
