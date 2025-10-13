const bcrypt = require('bcrypt');

const users = new Map();
const accounts = new Map();
const customers = new Map();
const cards = new Map();
const transactions = new Map();
const authorizations = new Map();
const transactionCategories = new Map();
const transactionTypes = new Map();
const disclosureGroups = new Map();

let transactionCounter = 1;
let authCounter = 1;
let customerCounter = 1000000000;
let accountCounter = 1000000000;

const initializeDefaultData = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    users.set('ADMIN001', {
        user_id: 'ADMIN001',
        first_name: 'Admin',
        last_name: 'User',
        password: hashedPassword,
        user_type: 'A',
        created_at: new Date(),
        updated_at: new Date()
    });

    transactionCategories.set('01', { category_code: '01', category_description: 'Merchandise', created_at: new Date() });
    transactionCategories.set('02', { category_code: '02', category_description: 'Bill Payment', created_at: new Date() });
    transactionCategories.set('03', { category_code: '03', category_description: 'Cash Advance', created_at: new Date() });
    transactionCategories.set('04', { category_code: '04', category_description: 'Balance Transfer', created_at: new Date() });
    transactionCategories.set('05', { category_code: '05', category_description: 'Interest Charge', created_at: new Date() });
    transactionCategories.set('06', { category_code: '06', category_description: 'Late Fee', created_at: new Date() });
    transactionCategories.set('07', { category_code: '07', category_description: 'Annual Fee', created_at: new Date() });
    transactionCategories.set('08', { category_code: '08', category_description: 'Service Fee', created_at: new Date() });
    transactionCategories.set('09', { category_code: '09', category_description: 'Credit Adjustment', created_at: new Date() });
    transactionCategories.set('10', { category_code: '10', category_description: 'Other', created_at: new Date() });

    transactionTypes.set('01', { type_code: '01', type_description: 'Interest Charge', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('02', { type_code: '02', type_description: 'Bill Payment', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('03', { type_code: '03', type_description: 'Purchase', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('04', { type_code: '04', type_description: 'Cash Advance', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('05', { type_code: '05', type_description: 'Balance Transfer', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('06', { type_code: '06', type_description: 'Fee', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('07', { type_code: '07', type_description: 'Credit', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('08', { type_code: '08', type_description: 'Refund', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('09', { type_code: '09', type_description: 'Adjustment', created_at: new Date(), updated_at: new Date() });
    transactionTypes.set('10', { type_code: '10', type_description: 'Other', created_at: new Date(), updated_at: new Date() });

    disclosureGroups.set('DEFAULT', { group_id: 'DEFAULT', group_description: 'Default Interest Rate', interest_rate: 19.99, created_at: new Date() });
    disclosureGroups.set('PREMIUM', { group_id: 'PREMIUM', group_description: 'Premium Customer Rate', interest_rate: 14.99, created_at: new Date() });
    disclosureGroups.set('STANDARD', { group_id: 'STANDARD', group_description: 'Standard Customer Rate', interest_rate: 17.99, created_at: new Date() });
    disclosureGroups.set('INTRO', { group_id: 'INTRO', group_description: 'Introductory Rate', interest_rate: 0.00, created_at: new Date() });
};

initializeDefaultData();

module.exports = {
    users,
    accounts,
    customers,
    cards,
    transactions,
    authorizations,
    transactionCategories,
    transactionTypes,
    disclosureGroups,
    getNextTransactionId: () => String(transactionCounter++).padStart(16, '0'),
    getNextAuthId: () => authCounter++,
    getNextCustomerId: () => customerCounter++,
    getNextAccountId: () => accountCounter++
};
