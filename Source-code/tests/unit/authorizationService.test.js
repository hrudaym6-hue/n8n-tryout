const authorizationService = require('../../services/AuthorizationService');
const Account = require('../../models/Account');
const Card = require('../../models/Card');

jest.mock('../../config/database');
jest.mock('../../models/Account');
jest.mock('../../models/Card');

describe('AuthorizationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('_calculateAvailableCredit', () => {
        it('should calculate available credit correctly', () => {
            const account = {
                credit_limit: 5000,
                current_balance: 1500
            };

            const result = authorizationService._calculateAvailableCredit(account);
            expect(result).toBe(3500);
        });

        it('should handle zero balance', () => {
            const account = {
                credit_limit: 5000,
                current_balance: 0
            };

            const result = authorizationService._calculateAvailableCredit(account);
            expect(result).toBe(5000);
        });
    });

    describe('_calculateDateComplement', () => {
        it('should calculate date complement correctly', () => {
            const date = new Date('2024-01-15');
            const result = authorizationService._calculateDateComplement(date);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(100000);
        });
    });

    describe('_calculateTimeComplement', () => {
        it('should calculate time complement correctly', () => {
            const time = new Date();
            const result = authorizationService._calculateTimeComplement(time);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(1000000000);
        });
    });
});
