const express = require('express');
const { createUser, login } = require('../controllers/userController');
const { validateUser, validateLogin } = require('../middleware/validation');
const router = express.Router();

router.post('/', validateUser, createUser);
router.post('/login', validateLogin, login);

module.exports = router;
