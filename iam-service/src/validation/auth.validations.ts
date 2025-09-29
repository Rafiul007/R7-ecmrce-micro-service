import { body, param } from 'express-validator';

export const signupValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const userIdValidation = [
  param('id').isMongoId().withMessage('Valid MongoDB user ID is required')
];

export const registerCustomerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),

  body('email').isEmail().withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('phone').trim().notEmpty().withMessage('Phone number is required'),

  // body('address.street').notEmpty().withMessage('Street is required'),
  // body('address.city').notEmpty().withMessage('City is required'),
  // body('address.country').notEmpty().withMessage('Country is required'),
  // body('address.state').optional().isString(),
  // body('address.zipCode').optional().isString(),

  body('customerType').isIn(['regular', 'vip', 'wholesale']).withMessage('Invalid customer type')
];
