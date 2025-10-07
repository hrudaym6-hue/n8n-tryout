const validateRequired = (fields) => {
    return (req, res, next) => {
        const missingFields = [];
        
        for (const field of fields) {
            const value = req.body[field];
            if (value === undefined || value === null || value === '' || 
                (typeof value === 'string' && value.trim() === '')) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: 'Required fields missing', 
                missingFields 
            });
        }
        
        next();
    };
};

const validateNumeric = (field) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value && isNaN(value)) {
            return res.status(400).json({ 
                error: `${field} must be numeric` 
            });
        }
        next();
    };
};

const validateLength = (field, minLength, maxLength) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value && (value.length < minLength || value.length > maxLength)) {
            return res.status(400).json({ 
                error: `${field} must be between ${minLength} and ${maxLength} characters` 
            });
        }
        next();
    };
};

const validatePattern = (field, pattern, message) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value && !pattern.test(value)) {
            return res.status(400).json({ 
                error: message || `${field} format is invalid` 
            });
        }
        next();
    };
};

const validateRange = (field, min, max) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value && (value < min || value > max)) {
            return res.status(400).json({ 
                error: `${field} must be between ${min} and ${max}` 
            });
        }
        next();
    };
};

const validatePhoneNumber = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    if (phoneNumber) {
        const areaCode = phoneNumber.substring(0, 3);
        const validAreaCodes = ['800', '888', '877', '866', '855', '844', '833'];
        
        if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
            return res.status(400).json({ 
                error: 'Phone number must be exactly 10 digits' 
            });
        }
        
        if (!validAreaCodes.includes(areaCode)) {
            return res.status(400).json({ 
                error: 'Invalid area code for phone number' 
            });
        }
    }
    next();
};

const validateSSN = (req, res, next) => {
    const ssn = req.body.ssn;
    if (ssn) {
        if (ssn.length !== 9 || isNaN(ssn)) {
            return res.status(400).json({ 
                error: 'SSN must be exactly 9 digits' 
            });
        }
    }
    next();
};

const validateFICO = (req, res, next) => {
    const fico = req.body.ficoCreditScore;
    if (fico !== undefined && fico !== null) {
        if (isNaN(fico) || fico < 300 || fico > 850) {
            return res.status(400).json({ 
                error: 'FICO score must be between 300 and 850' 
            });
        }
    }
    next();
};

const validateCardNumber = (req, res, next) => {
    const cardNumber = req.body.cardNumber || req.params.cardNumber;
    if (cardNumber) {
        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            return res.status(400).json({ 
                error: 'Card number must be exactly 16 digits' 
            });
        }
    }
    next();
};

const validateAccountId = (req, res, next) => {
    const accountId = req.body.accountId || req.params.accountId || req.params.id;
    if (accountId) {
        if (accountId.length !== 11 || isNaN(accountId)) {
            return res.status(400).json({ 
                error: 'Account ID must be exactly 11 digits' 
            });
        }
    }
    next();
};

const validateTransactionAmount = (req, res, next) => {
    const amount = req.body.transactionAmount || req.body.amount;
    if (amount !== undefined && amount !== null) {
        if (isNaN(amount) || amount < 0) {
            return res.status(400).json({ 
                error: 'Transaction amount must be a positive number' 
            });
        }
        
        const amountStr = amount.toString();
        const parts = amountStr.split('.');
        if (parts[0].length > 10 || (parts[1] && parts[1].length > 2)) {
            return res.status(400).json({ 
                error: 'Transaction amount format invalid (max 10 digits, 2 decimals)' 
            });
        }
    }
    next();
};

const validateMerchantId = (req, res, next) => {
    const merchantId = req.body.merchantId;
    if (merchantId) {
        if (merchantId.length !== 9 || isNaN(merchantId)) {
            return res.status(400).json({ 
                error: 'Merchant ID must be exactly 9 digits' 
            });
        }
    }
    next();
};

const validateTransactionId = (req, res, next) => {
    const transactionId = req.body.transactionId || req.params.transactionId || req.params.id;
    if (transactionId) {
        if (transactionId.length !== 16) {
            return res.status(400).json({ 
                error: 'Transaction ID must be exactly 16 characters' 
            });
        }
    }
    next();
};

const validateUserType = (req, res, next) => {
    const userType = req.body.userType;
    if (userType && !['U', 'A'].includes(userType)) {
        return res.status(400).json({ 
            error: 'User type must be either U (User) or A (Admin)' 
        });
    }
    next();
};

const validateAccountStatus = (req, res, next) => {
    const accountStatus = req.body.accountStatus;
    if (accountStatus && !['Y', 'N'].includes(accountStatus)) {
        return res.status(400).json({ 
            error: 'Account status must be either Y (Active) or N (Inactive)' 
        });
    }
    next();
};

const validateCardStatus = (req, res, next) => {
    const cardStatus = req.body.cardStatus;
    if (cardStatus && !['Y', 'N'].includes(cardStatus)) {
        return res.status(400).json({ 
            error: 'Card status must be either Y (Active) or N (Inactive)' 
        });
    }
    next();
};

module.exports = {
    validateRequired,
    validateNumeric,
    validateLength,
    validatePattern,
    validateRange,
    validatePhoneNumber,
    validateSSN,
    validateFICO,
    validateCardNumber,
    validateAccountId,
    validateTransactionAmount,
    validateMerchantId,
    validateTransactionId,
    validateUserType,
    validateAccountStatus,
    validateCardStatus
};
