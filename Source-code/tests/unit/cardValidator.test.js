const { cardSchema } = require('../../validators/cardValidator');

describe('Card Validator', () => {
    describe('cardSchema', () => {
        it('should validate a valid card', () => {
            const validCard = {
                cardNumber: '1234567890123456',
                accountId: 123456,
                customerId: 789012,
                expiryMonth: '12',
                expiryYear: '2025',
                cardStatus: 'Y'
            };

            const { error } = cardSchema.validate(validCard);
            expect(error).toBeUndefined();
        });

        it('should reject invalid card number length', () => {
            const invalidCard = {
                cardNumber: '12345',
                accountId: 123456,
                customerId: 789012,
                expiryMonth: '12',
                expiryYear: '2025',
                cardStatus: 'Y'
            };

            const { error } = cardSchema.validate(invalidCard);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('16 digits');
        });

        it('should reject invalid expiry month', () => {
            const invalidCard = {
                cardNumber: '1234567890123456',
                accountId: 123456,
                customerId: 789012,
                expiryMonth: '13',
                expiryYear: '2025',
                cardStatus: 'Y'
            };

            const { error } = cardSchema.validate(invalidCard);
            expect(error).toBeDefined();
        });

        it('should reject invalid expiry year', () => {
            const invalidCard = {
                cardNumber: '1234567890123456',
                accountId: 123456,
                customerId: 789012,
                expiryMonth: '12',
                expiryYear: '2100',
                cardStatus: 'Y'
            };

            const { error } = cardSchema.validate(invalidCard);
            expect(error).toBeDefined();
        });

        it('should reject invalid card status', () => {
            const invalidCard = {
                cardNumber: '1234567890123456',
                accountId: 123456,
                customerId: 789012,
                expiryMonth: '12',
                expiryYear: '2025',
                cardStatus: 'X'
            };

            const { error } = cardSchema.validate(invalidCard);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('Y or N');
        });
    });
});
