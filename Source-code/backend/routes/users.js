const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
    validateRequired,
    validateLength,
    validateUserType
} = require('../middleware/validation');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', userController.getAllUsers);

router.get('/:userId', userController.getUserById);

router.post('/',
    validateRequired(['userId', 'firstName', 'lastName', 'password', 'userType']),
    validateLength('userId', 1, 8),
    validateLength('firstName', 1, 25),
    validateLength('lastName', 1, 25),
    validateUserType,
    userController.createUser
);

router.put('/:userId',
    userController.updateUser
);

router.delete('/:userId', userController.deleteUser);

module.exports = router;
