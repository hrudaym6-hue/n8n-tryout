const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');

router.post('/login', validateRequired(['userId', 'password']), authController.login);

router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
