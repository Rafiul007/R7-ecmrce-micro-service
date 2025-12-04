import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { login, logout, refresh, registerUser } from '../controllers/auth.controller';

const router = express.Router();

/**
 * @api {post} /api/auth/register
 * @description Register a new base user (identity only).
 * @access Public
 * @body
 *   fullName: string (required)
 *   email: string (required)
 *   password: string (required)
 *   phone: string (optional)
 * @response
 *   201 Created
 *   { accessToken, user }
 */
router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  ],
  validateRequest,
  registerUser
);

/**
 * @api {post} /api/auth/login
 * @description Login with email + password.
 * @access Public
 * @body
 *   email: string (required)
 *   password: string (required)
 * @response
 *   200 OK
 *   { accessToken, user }
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  validateRequest,
  login
);

/**
 * @api {post} /api/auth/refresh
 * @description Generate new access + refresh token using refresh cookie.
 * @access Public (via cookie)
 * @response
 *   200 OK
 *   { accessToken }
 */
router.post('/refresh', refresh);

/**
 * @api {post} /api/auth/logout
 * @description Clear refresh-token cookie and logout user.
 * @access Public
 * @response
 *   200 OK
 */
router.post('/logout', logout);

export default router;
