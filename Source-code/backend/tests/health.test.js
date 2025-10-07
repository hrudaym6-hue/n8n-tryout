const request = require('supertest');
const app = require('../server');

describe('Health Check API', () => {
    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/api/health');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'healthy');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('environment');
        });
    });
});
