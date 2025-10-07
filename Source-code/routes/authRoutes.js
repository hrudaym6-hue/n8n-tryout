const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateLogin } = require('../validators/userValidator');

router.post('/login', validateLogin, userController.login);

module.exports = router;
