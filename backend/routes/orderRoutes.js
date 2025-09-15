const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validation');
const router = express.Router();
router.post('/', validateOrder, createOrder);
module.exports = router;
