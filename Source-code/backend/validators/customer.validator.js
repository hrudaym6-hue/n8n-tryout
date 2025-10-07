const Joi = require('joi');

const validatePhoneAreaCode = (value, helpers) => {
    const validAreaCodes = [
        '201', '202', '203', '205', '206', '207', '208', '209', '210', '212', '213', '214', '215', '216', '217', '218', '219',
        '224', '225', '228', '229', '231', '234', '239', '240', '248', '251', '252', '253', '254', '256', '260', '262', '267',
        '269', '270', '276', '281', '301', '302', '303', '304', '305', '307', '308', '309', '310', '312', '313', '314', '315',
        '316', '317', '318', '319', '320', '321', '323', '325', '330', '331', '334', '336', '337', '339', '347', '351', '352',
        '360', '361', '385', '386', '401', '402', '404', '405', '406', '407', '408', '409', '410', '412', '413', '414', '415',
        '417', '419', '423', '424', '425', '430', '432', '434', '435', '440', '443', '458', '469', '470', '475', '478', '479',
        '480', '484', '501', '502', '503', '504', '505', '507', '508', '509', '510', '512', '513', '515', '516', '517', '518',
        '520', '530', '531', '534', '539', '540', '541', '551', '559', '561', '562', '563', '564', '567', '570', '571', '573',
        '574', '575', '580', '585', '586', '601', '602', '603', '605', '606', '607', '608', '609', '610', '612', '614', '615',
        '616', '617', '618', '619', '620', '623', '626', '630', '631', '636', '641', '646', '650', '651', '657', '660', '661',
        '662', '667', '678', '682', '701', '702', '703', '704', '706', '707', '708', '712', '713', '714', '715', '716', '717',
        '718', '719', '720', '724', '727', '731', '732', '734', '737', '740', '747', '754', '757', '760', '762', '763', '765',
        '769', '770', '772', '773', '774', '775', '781', '785', '786', '801', '802', '803', '804', '805', '806', '808', '810',
        '812', '813', '814', '815', '816', '817', '818', '828', '830', '831', '832', '843', '845', '847', '848', '850', '856',
        '857', '858', '859', '860', '862', '863', '864', '865', '870', '872', '878', '901', '903', '904', '906', '907', '908',
        '909', '910', '912', '913', '914', '915', '916', '917', '918', '919', '920', '925', '928', '929', '931', '936', '937',
        '940', '941', '947', '949', '951', '952', '954', '956', '970', '971', '972', '973', '978', '979', '980', '984', '985', '989'
    ];
    
    const areaCode = value.substring(0, 3);
    if (!validAreaCodes.includes(areaCode)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const namePattern = /^[a-zA-Z\s]+$/;

const customerSchema = Joi.object({
    firstName: Joi.string().required().min(1).max(25).pattern(namePattern).messages({
        'string.empty': 'First Name can only contain alphabets and spaces',
        'any.required': 'First Name can only contain alphabets and spaces',
        'string.pattern.base': 'First Name can only contain alphabets and spaces'
    }),
    lastName: Joi.string().required().min(1).max(25).pattern(namePattern).messages({
        'string.empty': 'Last Name can only contain alphabets and spaces',
        'any.required': 'Last Name can only contain alphabets and spaces',
        'string.pattern.base': 'Last Name can only contain alphabets and spaces'
    }),
    dateOfBirth: Joi.date().optional().allow(null, ''),
    phoneNumber: Joi.string().optional().length(10).pattern(/^\d{10}$/).custom(validatePhoneAreaCode).messages({
        'string.length': 'Phone number must be 10 digits',
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.invalid': 'Area code is not valid'
    }),
    email: Joi.string().optional().email().max(50).allow(null, ''),
    addressLine1: Joi.string().optional().max(50).allow(null, ''),
    addressLine2: Joi.string().optional().max(50).allow(null, ''),
    city: Joi.string().optional().max(25).allow(null, ''),
    state: Joi.string().optional().length(2).allow(null, ''),
    zipCode: Joi.string().optional().max(10).allow(null, ''),
    ssn: Joi.string().optional().length(9).pattern(/^\d{9}$/).custom((value, helpers) => {
        if (value === '000000000') {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'string.length': 'SSN must be a 9 digit number',
        'string.pattern.base': 'SSN must be a 9 digit number',
        'any.invalid': 'SSN must be a 9 digit number'
    }),
    ficoScore: Joi.number().integer().min(0).max(850).optional().allow(null).messages({
        'number.base': 'FICO score must be numeric'
    })
});

const updateCustomerSchema = Joi.object({
    firstName: Joi.string().min(1).max(25).pattern(namePattern).messages({
        'string.pattern.base': 'First Name can only contain alphabets and spaces'
    }),
    lastName: Joi.string().min(1).max(25).pattern(namePattern).messages({
        'string.pattern.base': 'Last Name can only contain alphabets and spaces'
    }),
    dateOfBirth: Joi.date().optional().allow(null, ''),
    phoneNumber: Joi.string().length(10).pattern(/^\d{10}$/).custom(validatePhoneAreaCode).messages({
        'string.length': 'Phone number must be 10 digits',
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.invalid': 'Area code is not valid'
    }),
    email: Joi.string().email().max(50).allow(null, ''),
    addressLine1: Joi.string().max(50).allow(null, ''),
    addressLine2: Joi.string().max(50).allow(null, ''),
    city: Joi.string().max(25).allow(null, ''),
    state: Joi.string().length(2).allow(null, ''),
    zipCode: Joi.string().max(10).allow(null, ''),
    ssn: Joi.string().length(9).pattern(/^\d{9}$/).custom((value, helpers) => {
        if (value === '000000000') {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'string.length': 'SSN must be a 9 digit number',
        'string.pattern.base': 'SSN must be a 9 digit number',
        'any.invalid': 'SSN must be a 9 digit number'
    }),
    ficoScore: Joi.number().integer().min(0).max(850).allow(null).messages({
        'number.base': 'FICO score must be numeric'
    })
});

module.exports = {
    customerSchema,
    updateCustomerSchema
};
