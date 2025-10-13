const { cards, accounts } = require('../database/memoryStore');

class CardService {
    async getCards(filters = {}, page = 1, limit = 10) {
        let allCards = Array.from(cards.values());

        if (filters.accountId) {
            allCards = allCards.filter(c => c.account_id === filters.accountId);
        }

        if (filters.cardStatus) {
            allCards = allCards.filter(c => c.card_status === filters.cardStatus);
        }

        if (filters.cardType) {
            allCards = allCards.filter(c => c.card_type === filters.cardType);
        }

        allCards.sort((a, b) => a.card_number.localeCompare(b.card_number));

        const offset = (page - 1) * limit;
        const paginatedCards = allCards.slice(offset, offset + limit);

        const enrichedCards = paginatedCards.map(card => {
            const account = accounts.get(card.account_id) || {};
            return {
                ...card,
                account_status: account.account_status,
                credit_limit: account.credit_limit,
                current_balance: account.current_balance
            };
        });

        return {
            cards: enrichedCards,
            total: allCards.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getCardByNumber(cardNumber) {
        const card = cards.get(cardNumber);
        if (!card) {
            return null;
        }

        const account = accounts.get(card.account_id) || {};
        const { customers } = require('../database/memoryStore');
        const customer = customers.get(account.customer_id) || {};

        return {
            ...card,
            account_status: account.account_status,
            credit_limit: account.credit_limit,
            current_balance: account.current_balance,
            customer_id: account.customer_id,
            first_name: customer.first_name,
            last_name: customer.last_name
        };
    }

    async createCard(cardData) {
        const { cardNumber, accountId, cardType, expirationMonth, expirationYear, cvv } = cardData;

        if (cards.has(cardNumber)) {
            throw new Error('Card number already exists');
        }

        const account = accounts.get(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        const newCard = {
            card_number: cardNumber,
            account_id: accountId,
            card_type: cardType || 'CREDIT',
            card_status: 'Y',
            expiration_month: expirationMonth,
            expiration_year: expirationYear,
            cvv: cvv,
            issue_date: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };

        cards.set(cardNumber, newCard);
        return newCard;
    }

    async updateCard(cardNumber, updateData) {
        const card = cards.get(cardNumber);
        if (!card) {
            throw new Error('Card not found');
        }

        const allowedFields = [
            'card_status', 'expiration_month', 'expiration_year', 'card_type'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                card[field] = updateData[field];
            }
        }

        card.updated_at = new Date();
        cards.set(cardNumber, card);

        return card;
    }
}

module.exports = new CardService();
