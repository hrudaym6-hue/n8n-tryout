const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
    test('GET /api/health should return healthy status', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.status).toBe('healthy');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('environment');
        expect(response.body.database).toBe('in-memory');
    });
});
