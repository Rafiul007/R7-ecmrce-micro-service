import { body } from 'express-validator';
import { CustomerType } from '../models/customerModel';

const customerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),

  body('address').notEmpty().withMessage('Address is required'),
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.country').notEmpty().withMessage('Country is required'),

  body('customerType')
    .isIn(Object.values(CustomerType))
    .withMessage(`Customer type must be one of: ${Object.values(CustomerType).join(', ')}`)
];

export default customerValidation;
