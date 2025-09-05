import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAuthStatus,
  signUpUser,
  loginUser,
  logoutUser,
  getUser
} from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

/**
 * @route   GET /status
 * @desc    Check if auth service is up
 */
router.get('/status', getAuthStatus);

/**
 * @route   POST /signup
 * @desc    Register new user
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  signUpUser
);

/**
 * @route   POST /login
 * @desc    Login existing user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginUser
);

/**
 * @route   POST /logout
 * @desc    Logout user
 */
router.post('/logout', logoutUser);

/**
 * @route   GET /user/:id
 * @desc    Get user info by ID
 */
router.get(
  '/user/:id',
  [param('id').isMongoId().withMessage('Valid MongoDB user ID is required')],
  validateRequest,
  getUser
);

export default router;
