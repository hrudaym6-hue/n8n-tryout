const { accounts, customers, disclosureGroups } = require('../database/memoryStore');

class AccountService {
    async getAccounts(filters = {}, page = 1, limit = 10) {
        let allAccounts = Array.from(accounts.values());

        if (filters.accountId) {
            allAccounts = allAccounts.filter(a => a.account_id === filters.accountId);
        }

        if (filters.customerId) {
            allAccounts = allAccounts.filter(a => a.customer_id === filters.customerId);
        }

        if (filters.accountStatus) {
            allAccounts = allAccounts.filter(a => a.account_status === filters.accountStatus);
        }

        allAccounts.sort((a, b) => a.account_id - b.account_id);

        const offset = (page - 1) * limit;
        const paginatedAccounts = allAccounts.slice(offset, offset + limit);

        const enrichedAccounts = paginatedAccounts.map(account => {
            const customer = customers.get(account.customer_id) || {};
            const disclosureGroup = disclosureGroups.get(account.group_id) || {};
            
            return {
                ...account,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone_number: customer.phone_number,
                interest_rate: disclosureGroup.interest_rate,
                group_description: disclosureGroup.group_description
            };
        });

        return {
            accounts: enrichedAccounts,
            total: allAccounts.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAccountById(accountId) {
        const account = accounts.get(accountId);
        if (!account) {
            return null;
        }

        const customer = customers.get(account.customer_id) || {};
        const disclosureGroup = disclosureGroups.get(account.group_id) || {};

        return {
            ...account,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone_number: customer.phone_number,
            date_of_birth: customer.date_of_birth,
            address_line1: customer.address_line1,
            address_line2: customer.address_line2,
            city: customer.city,
            state: customer.state,
            zip_code: customer.zip_code,
            fico_credit_score: customer.fico_credit_score,
            interest_rate: disclosureGroup.interest_rate,
            group_description: disclosureGroup.group_description
        };
    }

    async updateAccount(accountId, updateData) {
        const account = accounts.get(accountId);
        
        if (!account) {
            throw new Error('Account not found');
        }

        const allowedFields = [
            'account_status', 'credit_limit', 'cash_credit_limit',
            'current_balance', 'current_cycle_credit', 'current_cycle_debit',
            'group_id', 'account_expiry_date'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                account[field] = updateData[field];
            }
        }

        account.updated_at = new Date();
        accounts.set(accountId, account);

        return account;
    }

    async calculateAvailableCredit(accountId) {
        const account = await this.getAccountById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        return {
            creditLimit: account.credit_limit,
            currentBalance: account.current_balance,
            availableCredit: account.credit_limit - account.current_balance,
            utilizationPercent: ((account.current_balance / account.credit_limit) * 100).toFixed(2)
        };
    }
}

module.exports = new AccountService();
