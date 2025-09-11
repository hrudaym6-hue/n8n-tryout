const CustomerService = require('../services/CustomerService');

module.exports = {
  async create(req, res, next) {
    try {
      const customer = await CustomerService.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      next(err);
    }
  },
  async list(req, res, next) {
    try {
      const customers = await CustomerService.findAll();
      res.json(customers);
    } catch (err) {
      next(err);
    }
  },
  async get(req, res, next) {
    try {
      const customer = await CustomerService.findById(req.params.id);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const customer = await CustomerService.update(req.params.id, req.body);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    try {
      await CustomerService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
}

