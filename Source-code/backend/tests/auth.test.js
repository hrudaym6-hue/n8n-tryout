const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
    describe('POST /api/auth/login', () => {
        it('should return 400 if userId or password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ userId: 'test' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if both fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/auth/verify', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/auth/verify');
            
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 403 if invalid token is provided', async () => {
            const res = await request(app)
                .get('/api/auth/verify')
                .set('Authorization', 'Bearer invalid-token');
            
            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('error');
        });
    });
});
