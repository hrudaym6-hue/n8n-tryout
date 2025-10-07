const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../validators/userValidator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requireAdmin, userController.getAllUsers);

router.get('/:userId', userController.getUser);

router.post('/', requireAdmin, validateUser, userController.createUser);

router.put('/:userId', validateUserUpdate, userController.updateUser);

router.delete('/:userId', requireAdmin, userController.deleteUser);

module.exports = router;
