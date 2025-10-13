const { authorizations, accounts, cards, getNextAuthId } = require('../database/memoryStore');

class AuthorizationService {
    async createAuthorization(authData) {
        const { cardNumber, transactionAmount, merchantId, merchantName } = authData;

        const card = cards.get(cardNumber);
        if (!card) {
            throw new Error('Card not found');
        }

        const account = accounts.get(card.account_id);
        if (!account) {
            throw new Error('Account not found');
        }

        const amount = parseFloat(transactionAmount);
        const availableCredit = account.credit_limit - account.current_balance;
        
        let authStatus = 'APPROVED';
        let declineReason = null;

        if (card.card_status !== 'Y') {
            authStatus = 'DECLINED';
            declineReason = 'Card is inactive';
        } else if (account.account_status !== 'Y') {
            authStatus = 'DECLINED';
            declineReason = 'Account is inactive';
        } else if (account.account_expiry_date) {
            const expiryDate = new Date(account.account_expiry_date);
            if (new Date() > expiryDate) {
                authStatus = 'DECLINED';
                declineReason = 'Account has expired';
            }
        } else if (amount > availableCredit) {
            authStatus = 'DECLINED';
            declineReason = 'Insufficient funds - amount exceeds available credit';
        }

        const authId = getNextAuthId();
        const newAuthorization = {
            authorization_id: authId,
            card_number: cardNumber,
            account_id: card.account_id,
            transaction_amount: amount,
            merchant_id: merchantId,
            merchant_name: merchantName,
            authorization_status: authStatus,
            decline_reason: declineReason,
            available_credit: availableCredit,
            authorization_date: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };

        authorizations.set(authId, newAuthorization);

        return newAuthorization;
    }

    async getAuthorizations(filters = {}, page = 1, limit = 10) {
        let allAuthorizations = Array.from(authorizations.values());

        if (filters.cardNumber) {
            allAuthorizations = allAuthorizations.filter(a => a.card_number === filters.cardNumber);
        }

        if (filters.accountId) {
            allAuthorizations = allAuthorizations.filter(a => a.account_id === filters.accountId);
        }

        if (filters.status) {
            allAuthorizations = allAuthorizations.filter(a => a.authorization_status === filters.status);
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            allAuthorizations = allAuthorizations.filter(a => new Date(a.authorization_date) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            allAuthorizations = allAuthorizations.filter(a => new Date(a.authorization_date) <= endDate);
        }

        allAuthorizations.sort((a, b) => new Date(b.authorization_date) - new Date(a.authorization_date));

        const offset = (page - 1) * limit;
        const paginatedAuthorizations = allAuthorizations.slice(offset, offset + limit);

        return {
            authorizations: paginatedAuthorizations,
            total: allAuthorizations.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAuthorizationById(authId) {
        const authorization = authorizations.get(authId);
        if (!authorization) {
            return null;
        }

        const card = cards.get(authorization.card_number) || {};
        const account = accounts.get(authorization.account_id) || {};

        return {
            ...authorization,
            card_type: card.card_type,
            account_status: account.account_status,
            credit_limit: account.credit_limit,
            current_balance: account.current_balance
        };
    }

    async purgeExpiredAuthorizations(expiryDays = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - expiryDays);

        let purgeCount = 0;
        let skipCount = 0;

        for (const [authId, auth] of authorizations.entries()) {
            const authDate = new Date(auth.authorization_date);
            if (authDate < cutoffDate) {
                authorizations.delete(authId);
                purgeCount++;
            } else {
                skipCount++;
            }
        }

        return {
            purged: purgeCount,
            skipped: skipCount,
            cutoffDate: cutoffDate.toISOString()
        };
    }
}

module.exports = new AuthorizationService();
