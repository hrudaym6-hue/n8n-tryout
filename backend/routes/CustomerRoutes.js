const router = require('express').Router();
const CustomerController = require('../controllers/CustomerController');
const { createCustomer, updateCustomer } = require('../validators/CustomerValidator');
const validate = require('../middlewares/validate');

router.post('/', createCustomer, validate, CustomerController.create);
router.get('/', CustomerController.list);
router.get('/:id', CustomerController.get);
router.put('/:id', updateCustomer, validate, CustomerController.update);
router.delete('/:id', CustomerController.remove);

module.exports = router;
