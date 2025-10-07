const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { validateCard, validateCardUpdate } = require('../validators/cardValidator');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:cardNumber', cardController.getCard);

router.get('/account/:accountId', cardController.getCardsByAccount);

router.get('/customer/:customerId', cardController.getCardsByCustomer);

router.get('/:cardNumber/validate', cardController.validateCard);

router.post('/', validateCard, cardController.createCard);

router.put('/:cardNumber', validateCardUpdate, cardController.updateCard);

module.exports = router;
