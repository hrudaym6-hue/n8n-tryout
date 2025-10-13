const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { 
    validateRequired, 
    validateCardNumber, 
    validateCardStatus,
    validateExpirationMonth,
    validateExpirationYear 
} = require('../middleware/validation');

router.get('/', authenticateSession, cardController.getCards);

router.get('/:cardNumber', authenticateSession, validateCardNumber, cardController.getCardByNumber);

router.post('/', 
    authenticateSession,
    requireAdmin,
    validateRequired(['cardNumber', 'accountId', 'expirationMonth', 'expirationYear']),
    validateCardNumber,
    validateExpirationMonth,
    validateExpirationYear,
    cardController.createCard
);

router.put('/:cardNumber', 
    authenticateSession,
    requireAdmin,
    validateCardNumber,
    validateCardStatus,
    validateExpirationMonth,
    validateExpirationYear,
    cardController.updateCard
);

module.exports = router;
