const { transactions, accounts, cards, transactionCategories, transactionTypes, getNextTransactionId } = require('../database/memoryStore');

class TransactionService {
    async createTransaction(transactionData) {
        const {
            accountId, cardNumber, transactionTypeCode, transactionCategoryCode,
            transactionSource, transactionDescription, transactionAmount,
            merchantId, merchantName, merchantCity, merchantZip
        } = transactionData;

        const account = accounts.get(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        const card = cards.get(cardNumber);
        if (!card) {
            throw new Error('Card not found');
        }

        const transactionId = getNextTransactionId();
        const originDate = new Date();
        const processDate = new Date();

        const newTransaction = {
            transaction_id: transactionId,
            account_id: accountId,
            card_number: cardNumber,
            transaction_type_code: transactionTypeCode,
            transaction_category_code: transactionCategoryCode,
            transaction_source: transactionSource,
            transaction_description: transactionDescription,
            transaction_amount: transactionAmount,
            merchant_id: merchantId,
            merchant_name: merchantName,
            merchant_city: merchantCity,
            merchant_zip: merchantZip,
            origin_date: originDate,
            process_date: processDate,
            created_at: new Date(),
            updated_at: new Date()
        };

        transactions.set(transactionId, newTransaction);

        const isDebit = ['03', '04', '05', '06'].includes(transactionTypeCode);
        const isCredit = ['02', '07', '08', '09'].includes(transactionTypeCode);

        if (isDebit) {
            account.current_balance = parseFloat(account.current_balance) + parseFloat(transactionAmount);
            account.current_cycle_debit = parseFloat(account.current_cycle_debit || 0) + parseFloat(transactionAmount);
            account.updated_at = new Date();
            accounts.set(accountId, account);
        } else if (isCredit) {
            account.current_balance = parseFloat(account.current_balance) - parseFloat(transactionAmount);
            account.current_cycle_credit = parseFloat(account.current_cycle_credit || 0) + parseFloat(transactionAmount);
            account.updated_at = new Date();
            accounts.set(accountId, account);
        }

        return newTransaction;
    }

    async getTransactions(filters = {}, page = 1, limit = 10) {
        let allTransactions = Array.from(transactions.values());

        if (filters.accountId) {
            allTransactions = allTransactions.filter(t => t.account_id === filters.accountId);
        }

        if (filters.cardNumber) {
            allTransactions = allTransactions.filter(t => t.card_number === filters.cardNumber);
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            allTransactions = allTransactions.filter(t => new Date(t.process_date) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            allTransactions = allTransactions.filter(t => new Date(t.process_date) <= endDate);
        }

        allTransactions.sort((a, b) => new Date(b.process_date) - new Date(a.process_date));

        const offset = (page - 1) * limit;
        const paginatedTransactions = allTransactions.slice(offset, offset + limit);

        const enrichedTransactions = paginatedTransactions.map(transaction => {
            const type = transactionTypes.get(transaction.transaction_type_code) || {};
            const category = transactionCategories.get(transaction.transaction_category_code) || {};
            const account = accounts.get(transaction.account_id) || {};
            const card = cards.get(transaction.card_number) || {};
            
            return {
                ...transaction,
                type_description: type.type_description,
                category_description: category.category_description,
                customer_id: account.customer_id,
                card_type: card.card_type
            };
        });

        return {
            transactions: enrichedTransactions,
            total: allTransactions.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getTransactionById(transactionId) {
        const transaction = transactions.get(transactionId);
        if (!transaction) {
            return null;
        }

        const type = transactionTypes.get(transaction.transaction_type_code) || {};
        const category = transactionCategories.get(transaction.transaction_category_code) || {};
        const account = accounts.get(transaction.account_id) || {};
        const card = cards.get(transaction.card_number) || {};
        const customer = customers.get(account.customer_id) || {};

        return {
            ...transaction,
            type_description: type.type_description,
            category_description: category.category_description,
            customer_id: account.customer_id,
            card_type: card.card_type,
            first_name: customer.first_name,
            last_name: customer.last_name
        };
    }
}

module.exports = new TransactionService();
