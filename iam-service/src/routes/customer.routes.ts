import express from 'express';
import { body } from 'express-validator';
import { createCustomerProfile } from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

/**
 * @api {post} /api/customer/create
 * @description Create a customer profile for the authenticated user.
 * @access User Auth Required
 * @body
 *   address.street: string (required)
 *   address.city: string (required)
 *   address.country: string (required)
 *   customerType: "regular" | "vip" | "wholesale" (optional)
 *   gender: "male" | "female" | "other" (required)
 *  dateOfBirth: string (ISO 8601 date, required)
 * @response
 *   201 Created
 *   { profile }
 */
router.post(
  '/register',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Valid email is required'),

    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.country').notEmpty().withMessage('Country is required'),

    body('gender')
      .notEmpty()
      .withMessage('Gender is required')
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female or other'),

    body('dateOfBirth')
      .notEmpty()
      .withMessage('Date of birth is required')
      .isISO8601()
      .withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
  ],
  validateRequest,
  createCustomerProfile
);

export default router;
