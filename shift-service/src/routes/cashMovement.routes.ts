import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createCashMovement,
  listCashMovements
} from '../controllers/cashMovement.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';

const router = Router();

/**
 * ============================
 * CASH MOVEMENT ROUTES
 * ============================
 * Base URL: /cash-movements
 */

/** POST /cash-movements */
router.post(
  '/',
  isAuthenticated,
  [
    body('shiftId').isMongoId().withMessage('Valid shiftId is required'),
    body('type').isIn(['in', 'out']).withMessage('type must be in or out'),
    body('amount').isFloat({ min: 0.01 }).withMessage('amount must be greater than 0'),
    body('reason').optional().isString().trim().isLength({ max: 500 }),
    body('createdByName').optional().isString().trim()
  ],
  validateRequest,
  requirePermission(PERMISSION.CASH_MOVEMENT_CREATE),
  createCashMovement
);

/** GET /cash-movements */
router.get(
  '/',
  isAuthenticated,
  [
    query('shiftId').isMongoId().withMessage('Valid shiftId is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  requirePermission(PERMISSION.CASH_MOVEMENT_READ),
  listCashMovements
);

export default router;
