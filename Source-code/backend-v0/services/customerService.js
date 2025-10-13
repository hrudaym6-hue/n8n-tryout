const { customers, getNextCustomerId } = require('../database/memoryStore');

class CustomerService {
    async getAllCustomers(page = 1, limit = 10) {
        const allCustomers = Array.from(customers.values());
        const offset = (page - 1) * limit;
        const paginatedCustomers = allCustomers.slice(offset, offset + limit);

        return {
            customers: paginatedCustomers,
            total: allCustomers.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getCustomerById(customerId) {
        return customers.get(customerId) || null;
    }

    async createCustomer(customerData) {
        const {
            customerId, firstName, lastName, dateOfBirth, phoneNumber,
            ssn, email, addressLine1, addressLine2, city, state,
            zipCode, ficoCreditScore
        } = customerData;

        const id = customerId || getNextCustomerId();

        const newCustomer = {
            customer_id: id,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            phone_number: phoneNumber,
            ssn: ssn,
            email: email,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            zip_code: zipCode,
            fico_credit_score: ficoCreditScore,
            created_at: new Date(),
            updated_at: new Date()
        };

        customers.set(id, newCustomer);

        return newCustomer;
    }

    async updateCustomer(customerId, updateData) {
        const customer = customers.get(customerId);
        
        if (!customer) {
            throw new Error('Customer not found');
        }

        const allowedFields = [
            'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'ssn', 'email', 'address_line1', 'address_line2', 'city',
            'state', 'zip_code', 'fico_credit_score'
        ];

        for (const field of allowedFields) {
            const camelCaseField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (updateData[camelCaseField] !== undefined) {
                customer[field] = updateData[camelCaseField];
            }
        }

        customer.updated_at = new Date();
        customers.set(customerId, customer);

        return customer;
    }
}

module.exports = new CustomerService();
