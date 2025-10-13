const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authenticateToken } = require('../middleware/auth');
const { validateCardNumber, validateCardStatus } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', cardController.getCards);

router.get('/:cardNumber', validateCardNumber, cardController.getCardByNumber);

router.put('/:cardNumber',
    validateCardNumber,
    validateCardStatus,
    cardController.updateCard
);

module.exports = router;
