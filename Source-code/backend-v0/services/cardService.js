const { cards, accounts, customers } = require('../database/memoryStore');

class CardService {
    async getCards(filters = {}, page = 1, limit = 10) {
        let allCards = Array.from(cards.values());

        if (filters.cardNumber) {
            allCards = allCards.filter(c => c.card_number === filters.cardNumber);
        }

        if (filters.accountId) {
            allCards = allCards.filter(c => c.account_id === filters.accountId);
        }

        if (filters.customerId) {
            allCards = allCards.filter(c => c.customer_id === filters.customerId);
        }

        if (filters.cardStatus) {
            allCards = allCards.filter(c => c.card_status === filters.cardStatus);
        }

        allCards.sort((a, b) => a.card_number.localeCompare(b.card_number));

        const offset = (page - 1) * limit;
        const paginatedCards = allCards.slice(offset, offset + limit);

        const enrichedCards = paginatedCards.map(card => {
            const account = accounts.get(card.account_id) || {};
            const customer = customers.get(card.customer_id) || {};
            
            return {
                ...card,
                credit_limit: account.credit_limit,
                current_balance: account.current_balance,
                first_name: customer.first_name,
                last_name: customer.last_name
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
        const customer = customers.get(card.customer_id) || {};

        return {
            ...card,
            credit_limit: account.credit_limit,
            current_balance: account.current_balance,
            account_status: account.account_status,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone_number: customer.phone_number
        };
    }

    async updateCard(cardNumber, updateData) {
        const card = cards.get(cardNumber);
        
        if (!card) {
            throw new Error('Card not found');
        }

        const allowedFields = [
            'card_type', 'expiry_month', 'expiry_year', 'cvv_code',
            'embossed_name', 'card_status', 'is_primary'
        ];

        for (const field of allowedFields) {
            const camelCaseField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (updateData[camelCaseField] !== undefined) {
                card[field] = updateData[camelCaseField];
            }
        }

        card.updated_at = new Date();
        cards.set(cardNumber, card);

        return card;
    }
}

module.exports = new CardService();
