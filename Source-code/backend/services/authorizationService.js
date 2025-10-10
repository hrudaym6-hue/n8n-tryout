const { authorizations, accounts, cards, customers, getNextAuthId } = require('../database/memoryStore');

class AuthorizationService {
    async processAuthorization(authData) {
        const { accountId, cardNumber, transactionAmount, merchantId, merchantName, merchantCity, merchantZip } = authData;

        const account = accounts.get(accountId);

        if (!account) {
            return {
                responseCode: '14',
                reasonCode: 'ACNT',
                approvedAmount: 0,
                message: 'Account not found'
            };
        }

        if (account.account_status !== 'Y') {
            return {
                responseCode: '05',
                reasonCode: 'ACST',
                approvedAmount: 0,
                message: 'Account is not active'
            };
        }

        const card = cards.get(cardNumber);

        if (!card || card.account_id !== accountId) {
            return {
                responseCode: '14',
                reasonCode: 'CARD',
                approvedAmount: 0,
                message: 'Card not found or does not belong to account'
            };
        }

        if (card.card_status !== 'Y') {
            return {
                responseCode: '04',
                reasonCode: 'CDST',
                approvedAmount: 0,
                message: 'Card is not active'
            };
        }

        const availableCredit = account.credit_limit - account.current_balance;

        if (transactionAmount > availableCredit) {
            return {
                responseCode: '51',
                reasonCode: 'CRED',
                approvedAmount: 0,
                message: 'Insufficient credit available'
            };
        }

        if (transactionAmount > account.credit_limit) {
            return {
                responseCode: '61',
                reasonCode: 'LIMIT',
                approvedAmount: 0,
                message: 'Transaction amount exceeds credit limit'
            };
        }

        const authTime = new Date();
        const authId = getNextAuthId();

        const newAuth = {
            auth_id: authId,
            account_id: accountId,
            card_number: cardNumber,
            transaction_amount: transactionAmount,
            merchant_id: merchantId,
            merchant_name: merchantName,
            merchant_city: merchantCity,
            merchant_zip: merchantZip,
            auth_date: authTime,
            auth_time: authTime,
            response_code: '00',
            approved_amount: transactionAmount,
            reason_code: 'APPR',
            created_at: new Date(),
            updated_at: new Date()
        };

        authorizations.set(authId, newAuth);

        account.current_balance = parseFloat(account.current_balance) + parseFloat(transactionAmount);
        account.updated_at = new Date();
        accounts.set(accountId, account);

        return {
            responseCode: '00',
            reasonCode: 'APPR',
            approvedAmount: transactionAmount,
            message: 'Authorization approved',
            authId: authId
        };
    }

    async getAuthorizationsByAccount(accountId, page = 1, limit = 10) {
        let allAuths = Array.from(authorizations.values())
            .filter(a => a.account_id === accountId)
            .sort((a, b) => new Date(b.auth_date) - new Date(a.auth_date));

        const offset = (page - 1) * limit;
        const paginatedAuths = allAuths.slice(offset, offset + limit);

        const enrichedAuths = paginatedAuths.map(auth => {
            const account = accounts.get(auth.account_id) || {};
            const card = cards.get(auth.card_number) || {};
            
            return {
                ...auth,
                customer_id: account.customer_id,
                card_type: card.card_type
            };
        });

        return {
            authorizations: enrichedAuths,
            total: allAuths.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAuthorizationById(authId) {
        const auth = authorizations.get(authId);
        if (!auth) {
            return null;
        }

        const account = accounts.get(auth.account_id) || {};
        const card = cards.get(auth.card_number) || {};
        const customer = customers.get(account.customer_id) || {};

        return {
            ...auth,
            customer_id: account.customer_id,
            card_type: card.card_type,
            first_name: customer.first_name,
            last_name: customer.last_name
        };
    }
}

module.exports = new AuthorizationService();
