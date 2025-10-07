const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');
const { validateAuthorization } = require('../validators/authorizationValidator');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', validateAuthorization, authorizationController.createAuthorization);

router.get('/account/:accountId', authorizationController.getAuthorizationsByAccount);

router.post('/purge', authorizationController.purgeExpiredAuthorizations);

module.exports = router;
