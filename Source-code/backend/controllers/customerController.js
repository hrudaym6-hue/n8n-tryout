const customerService = require('../services/customerService');

exports.getCustomers = async (req, res, next) => {
    try {
        const { customerId, lastName, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        if (customerId) filters.customerId = customerId;
        if (lastName) filters.lastName = lastName;

        const result = await customerService.getCustomers(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
        
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        next(error);
    }
};

exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.updateCustomer(id, req.body);
        res.json(customer);
    } catch (error) {
        next(error);
    }
};
