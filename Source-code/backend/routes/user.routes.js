const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { createUserSchema, updateUserSchema } = require('../validators/user.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    userId: Joi.string().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, userId } = req.query;
        const result = await userService.getAllUsers(page, limit, userId);
        res.json(result);
    })
);

router.get('/:userId',
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);
        res.json(user);
    })
);

router.post('/',
    requireAdmin,
    validate(createUserSchema),
    asyncHandler(async (req, res) => {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    })
);

router.put('/:userId',
    requireAdmin,
    validate(updateUserSchema),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const user = await userService.updateUser(userId, req.body);
        res.json(user);
    })
);

router.delete('/:userId',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const result = await userService.deleteUser(userId);
        res.json(result);
    })
);

module.exports = router;
