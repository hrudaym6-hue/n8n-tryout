const Customer = require('../models/Customer');
const logger = require('../config/logger');

class CustomerController {
    async getCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const customer = await Customer.findById(customerId);

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.json(customer);
        } catch (error) {
            logger.error('Get customer error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to fetch customer', message: error.message });
        }
    }

    async getAllCustomers(req, res) {
        try {
            const { page, limit, search } = req.query;
            const result = await Customer.findAll({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                search
            });

            res.json(result);
        } catch (error) {
            logger.error('Get all customers error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch customers', message: error.message });
        }
    }

    async createCustomer(req, res) {
        try {
            const customerData = req.validatedData;
            const customer = await Customer.create(customerData);

            res.status(201).json(customer);
        } catch (error) {
            logger.error('Create customer error', { error: error.message, stack: error.stack });
            
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Customer ID already exists' });
            }
            
            res.status(500).json({ error: 'Failed to create customer', message: error.message });
        }
    }

    async updateCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const updates = req.validatedData;

            const customer = await Customer.update(customerId, updates);

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.json(customer);
        } catch (error) {
            logger.error('Update customer error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to update customer', message: error.message });
        }
    }

    async deleteCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const customer = await Customer.delete(customerId);

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.json({ message: 'Customer deleted successfully', customer });
        } catch (error) {
            logger.error('Delete customer error', { error: error.message, stack: error.stack });
            
            if (error.code === '23503') {
                return res.status(400).json({ 
                    error: 'Cannot delete customer with existing accounts or cards' 
                });
            }
            
            res.status(500).json({ error: 'Failed to delete customer', message: error.message });
        }
    }
}

module.exports = new CustomerController();
