const request = require('supertest');
const app = require('../server');

describe('Health Check API', () => {
    describe('GET /api/health', () => {
        it('should return 200 and health status', async () => {
            const response = await request(app).get('/api/health');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('service');
        });
    });
});
