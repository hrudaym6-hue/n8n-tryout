const request = require('supertest');
const app = require('../server');
const { accounts, customers, users } = require('../database/memoryStore');

describe('Account API', () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        await agent
            .post('/api/auth/login')
            .send({ userId: 'ADMIN001', password: 'admin123' });
    });

    beforeEach(() => {
        accounts.clear();
        customers.clear();
        
        customers.set('1000000001', {
            customer_id: '1000000001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone_number: '8001234567',
            created_at: new Date()
        });

        accounts.set('10000000001', {
            account_id: '10000000001',
            customer_id: '1000000001',
            account_status: 'Y',
            credit_limit: 5000.00,
            current_balance: 1000.00,
            group_id: 'DEFAULT',
            created_at: new Date()
        });
    });

    describe('GET /api/accounts', () => {
        test('should return list of accounts', async () => {
            const response = await agent
                .get('/api/accounts')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('accounts');
            expect(response.body).toHaveProperty('total');
            expect(response.body.accounts.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/accounts/:id', () => {
        test('should return account by ID', async () => {
            const response = await agent
                .get('/api/accounts/10000000001')
                .expect(200);

            expect(response.body.account_id).toBe('10000000001');
            expect(response.body.customer_id).toBe('1000000001');
        });

        test('should return 404 for non-existent account', async () => {
            const response = await agent
                .get('/api/accounts/99999999999')
                .expect(404);

            expect(response.body.error).toBe('Account not found');
        });
    });

    describe('GET /api/accounts/:id/available-credit', () => {
        test('should calculate available credit', async () => {
            const response = await agent
                .get('/api/accounts/10000000001/available-credit')
                .expect(200);

            expect(response.body).toHaveProperty('creditLimit');
            expect(response.body).toHaveProperty('currentBalance');
            expect(response.body).toHaveProperty('availableCredit');
            expect(parseFloat(response.body.availableCredit)).toBe(4000.00);
        });
    });
});
