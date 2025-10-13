const request = require('supertest');
const app = require('../server');
const { transactions, accounts, cards } = require('../database/memoryStore');

describe('Transaction API', () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        await agent
            .post('/api/auth/login')
            .send({ userId: 'ADMIN001', password: 'admin123' });
    });

    beforeEach(() => {
        transactions.clear();
        accounts.clear();
        cards.clear();

        accounts.set('10000000001', {
            account_id: '10000000001',
            customer_id: '1000000001',
            account_status: 'Y',
            credit_limit: 5000.00,
            current_balance: 1000.00,
            current_cycle_debit: 0,
            current_cycle_credit: 0,
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

    describe('GET /api/transactions', () => {
        test('should return list of transactions', async () => {
            const response = await agent
                .get('/api/transactions')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('transactions');
            expect(response.body).toHaveProperty('total');
        });
    });

    describe('POST /api/transactions', () => {
        test('should create a new transaction', async () => {
            const transactionData = {
                accountId: '10000000001',
                cardNumber: '4111111111111111',
                transactionTypeCode: '03',
                transactionCategoryCode: '01',
                transactionSource: 'POS',
                transactionDescription: 'Purchase at Store',
                transactionAmount: 100.50,
                merchantId: '123456789',
                merchantName: 'Test Merchant',
                merchantCity: 'New York',
                merchantZip: '10001'
            };

            const response = await agent
                .post('/api/transactions')
                .send(transactionData)
                .expect(201);

            expect(response.body).toHaveProperty('transaction_id');
            expect(response.body.transaction_amount).toBe(100.50);
        });

        test('should fail if transaction exceeds available credit', async () => {
            const transactionData = {
                accountId: '10000000001',
                cardNumber: '4111111111111111',
                transactionTypeCode: '03',
                transactionCategoryCode: '01',
                transactionSource: 'POS',
                transactionDescription: 'Large Purchase',
                transactionAmount: 10000.00,
                merchantId: '123456789',
                merchantName: 'Test Merchant',
                merchantCity: 'New York',
                merchantZip: '10001'
            };

            const response = await agent
                .post('/api/transactions')
                .send(transactionData)
                .expect(500);

            expect(response.body.error).toContain('exceeds available credit');
        });
    });
});
