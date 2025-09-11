const router = require('express').Router();
const controller = require('../controllers/userController');
const validate = require('../validation/validate');
const { createUser } = require('../validation/userValidation');
router.post('/', validate(createUser), controller.create);
router.get('/:id', controller.get);
module.exports = router;
