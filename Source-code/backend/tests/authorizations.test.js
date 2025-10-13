const request = require('supertest');
const app = require('../server');
const { authorizations, accounts, cards } = require('../database/memoryStore');

describe('Authorization API', () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        await agent
            .post('/api/auth/login')
            .send({ userId: 'ADMIN001', password: 'admin123' });
    });

    beforeEach(() => {
        authorizations.clear();
        accounts.clear();
        cards.clear();

        accounts.set('10000000001', {
            account_id: '10000000001',
            customer_id: '1000000001',
            account_status: 'Y',
            credit_limit: 5000.00,
            current_balance: 1000.00,
            account_expiry_date: null,
            created_at: new Date()
        });

        cards.set('4111111111111111', {
            card_number: '4111111111111111',
            account_id: '10000000001',
            card_status: 'Y',
            card_type: 'CREDIT',
            created_at: new Date()
        });
    });

    describe('POST /api/authorizations', () => {
        test('should approve authorization with sufficient credit', async () => {
            const authData = {
                cardNumber: '4111111111111111',
                transactionAmount: 500.00,
                merchantId: '123456789',
                merchantName: 'Test Merchant'
            };

            const response = await agent
                .post('/api/authorizations')
                .send(authData)
                .expect(201);

            expect(response.body.authorization_status).toBe('APPROVED');
            expect(response.body.transaction_amount).toBe(500.00);
        });

        test('should decline authorization with insufficient credit', async () => {
            const authData = {
                cardNumber: '4111111111111111',
                transactionAmount: 10000.00,
                merchantId: '123456789',
                merchantName: 'Test Merchant'
            };

            const response = await agent
                .post('/api/authorizations')
                .send(authData)
                .expect(201);

            expect(response.body.authorization_status).toBe('DECLINED');
            expect(response.body.decline_reason).toContain('Insufficient funds');
        });
    });

    describe('GET /api/authorizations', () => {
        test('should return list of authorizations', async () => {
            const response = await agent
                .get('/api/authorizations')
                .expect(200);

            expect(response.body).toHaveProperty('authorizations');
            expect(response.body).toHaveProperty('total');
        });
    });
});
