const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { validate } = require('../middleware/validation');
const { loginSchema } = require('../validators/auth.validator');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/login', 
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const { userId, password } = req.body;
        const result = await authService.login(userId, password);
        res.json(result);
    })
);

module.exports = router;
