const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateSession } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');

router.post('/register', validateRequired(['userId', 'firstName', 'lastName', 'password']), authController.register);
router.post('/login', validateRequired(['userId', 'password']), authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authenticateSession, authController.verifySession);

module.exports = router;
