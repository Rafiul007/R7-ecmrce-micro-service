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
