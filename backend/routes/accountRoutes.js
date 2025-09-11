const router = require('express').Router();
const controller = require('../controllers/accountController');
const validate = require('../validation/validate');
const { createAccount } = require('../validation/accountValidation');
router.post('/', validate(createAccount), controller.create);
router.get('/:id', controller.get);
module.exports = router;
