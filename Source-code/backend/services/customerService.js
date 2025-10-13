const { customers, getNextCustomerId } = require('../database/memoryStore');

class CustomerService {
    async getCustomers(filters = {}, page = 1, limit = 10) {
        let allCustomers = Array.from(customers.values());

        if (filters.customerId) {
            allCustomers = allCustomers.filter(c => c.customer_id === filters.customerId);
        }

        if (filters.lastName) {
            allCustomers = allCustomers.filter(c => 
                c.last_name.toLowerCase().includes(filters.lastName.toLowerCase())
            );
        }

        allCustomers.sort((a, b) => a.customer_id - b.customer_id);

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
        const customerId = String(getNextCustomerId());

        const newCustomer = {
            customer_id: customerId,
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            date_of_birth: customerData.dateOfBirth,
            ssn: customerData.ssn,
            email: customerData.email,
            phone_number: customerData.phoneNumber,
            address_line1: customerData.addressLine1,
            address_line2: customerData.addressLine2 || '',
            city: customerData.city,
            state: customerData.state,
            zip_code: customerData.zipCode,
            fico_credit_score: customerData.ficoCreditScore || 650,
            created_at: new Date(),
            updated_at: new Date()
        };

        customers.set(customerId, newCustomer);
        return newCustomer;
    }

    async updateCustomer(customerId, updateData) {
        const customer = customers.get(customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const allowedFields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'address_line1', 'address_line2', 'city', 'state', 'zip_code',
            'fico_credit_score'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                customer[field] = updateData[field];
            }
        }

        customer.updated_at = new Date();
        customers.set(customerId, customer);

        return customer;
    }
}

module.exports = new CustomerService();
