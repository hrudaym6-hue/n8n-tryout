const Account = require('../models/Account');
const logger = require('../config/logger');

class AccountController {
    async getAccount(req, res) {
        try {
            const { accountId } = req.params;
            const account = await Account.findById(accountId);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json(account);
        } catch (error) {
            logger.error('Get account error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to fetch account', message: error.message });
        }
    }

    async getAccountsByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const accounts = await Account.findByCustomerId(customerId);

            res.json({ accounts });
        } catch (error) {
            logger.error('Get accounts by customer error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch accounts', message: error.message });
        }
    }

    async createAccount(req, res) {
        try {
            const accountData = req.validatedData;
            const account = await Account.create(accountData);

            res.status(201).json(account);
        } catch (error) {
            logger.error('Create account error', { error: error.message, stack: error.stack });
            
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Account ID already exists' });
            }
            if (error.code === '23503') {
                return res.status(400).json({ error: 'Customer not found' });
            }
            
            res.status(500).json({ error: 'Failed to create account', message: error.message });
        }
    }

    async updateAccount(req, res) {
        try {
            const { accountId } = req.params;
            const updates = req.validatedData;

            const account = await Account.update(accountId, updates);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json(account);
        } catch (error) {
            logger.error('Update account error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to update account', message: error.message });
        }
    }

    async getAvailableCredit(req, res) {
        try {
            const { accountId } = req.params;
            const availableCredit = await Account.getAvailableCredit(accountId);

            if (availableCredit === null) {
                return res.status(404).json({ error: 'Account not found' });
            }

            res.json({ accountId, availableCredit });
        } catch (error) {
            logger.error('Get available credit error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch available credit', message: error.message });
        }
    }
}

module.exports = new AccountController();
