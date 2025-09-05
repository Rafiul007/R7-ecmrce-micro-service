import { Request, Response, NextFunction, Router } from 'express';
import { body } from 'express-validator';
import { createCustomerProfile, getMyCustomerProfile } from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();

export const logRequestBody = (req: Request, res: Response, next: NextFunction) => {
  console.log('Request Body:', req.body);
  next();
};

/**
 * @route   POST /customer/profile
 * @desc    Create customer profile for the authenticated user
 * @access  Private
 */
router.post(
  '/profile',
  logRequestBody,
  isAuthenticated,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('address')
      .optional()
      .custom((v) => typeof v === 'string' || typeof v === 'object')
      .withMessage('Address must be a string or an object')
  ],
  validateRequest,
  createCustomerProfile
);

/**
 * @route   GET /customer/profile
 * @desc    Get the current authenticated user's customer profile
 * @access  Private
 */
router.get('/profile', isAuthenticated, getMyCustomerProfile);

export default router;
