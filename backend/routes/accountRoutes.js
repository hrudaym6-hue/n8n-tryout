const express = require('express');
const { createAccount } = require('../controllers/accountController');
const { validateAccount } = require('../middleware/validation');
const router = express.Router();

router.post('/', validateAccount, createAccount);

module.exports = router;
