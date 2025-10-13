const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { validateRequired, validateUserType } = require('../middleware/validation');

router.get('/', authenticateSession, requireAdmin, userController.getUsers);

router.get('/:id', authenticateSession, requireAdmin, userController.getUserById);

router.post('/', 
    authenticateSession,
    requireAdmin,
    validateRequired(['userId', 'firstName', 'lastName', 'password']),
    validateUserType,
    userController.createUser
);

router.put('/:id', 
    authenticateSession,
    requireAdmin,
    validateUserType,
    userController.updateUser
);

router.delete('/:id', 
    authenticateSession,
    requireAdmin,
    userController.deleteUser
);

module.exports = router;
