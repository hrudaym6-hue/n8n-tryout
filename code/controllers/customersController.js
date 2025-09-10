const customerService = require('../services/customerService');
const auditLogService = require('../services/auditLogService');
module.exports = {
  list: async (req, res) => {
    try {
      const customers = await customerService.list();
      res.json(customers);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'List customers failed', details: err });
      res.status(500).json({ error: 'List customers failed' });
    }
  },
  get: async (req, res) => {
    try {
      const customer = await customerService.get(req.params.id);
      if (!customer)
        return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Get customer failed', details: err });
      res.status(500).json({ error: 'Get customer failed' });
    }
  },
  create: async (req, res) => {
    try {
      const newC = await customerService.create(req.body);
      await auditLogService.log({ eventType: 'create', message: 'Customer created', details: newC });
      res.status(201).json(newC);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Create customer failed', details: err });
      res.status(500).json({ error: 'Create customer failed' });
    }
  },
  update: async (req, res) => {
    try {
      const updatedC = await customerService.update(req.params.id, req.body);
      await auditLogService.log({ eventType: 'update', message: 'Customer updated', details: updatedC });
      res.json(updatedC);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Update customer failed', details: err });
      res.status(500).json({ error: 'Update customer failed' });
    }
  },
  delete: async (req, res) => {
    try {
      const deleted = await customerService.delete(req.params.id);
      await auditLogService.log({ eventType: 'delete', message: 'Customer deleted', details: deleted });
      res.json(deleted);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Delete customer failed', details: err });
      res.status(500).json({ error: 'Delete customer failed' });
    }
  }
};
