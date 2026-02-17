import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  openShift,
  closeShift,
  getActiveShift,
  listShifts,
  getShiftById
} from '../controllers/shift.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';

const router = Router();

/**
 * ============================
 * SHIFT ROUTES
 * ============================
 * Base URL: /shifts
 */

/** POST /shifts/open */
router.post(
  '/open',
  isAuthenticated,
  [
    body('branchId').isString().trim().notEmpty().withMessage('branchId is required'),
    body('branchName').isString().trim().notEmpty().withMessage('branchName is required'),
    body('openingCash').isFloat({ min: 0 }).withMessage('openingCash must be a number'),
    body('openedByName').optional().isString().trim(),
    body('notes').optional().isString().trim().isLength({ max: 2000 })
  ],
  validateRequest,
  requirePermission(PERMISSION.SHIFT_OPEN),
  openShift
);

/** POST /shifts/:id/close */
router.post(
  '/:id/close',
  isAuthenticated,
  [
    param('id').isMongoId().withMessage('Invalid shift id'),
    body('closingCash').isFloat({ min: 0 }).withMessage('closingCash is required'),
    body('cashSalesTotal').optional().isFloat({ min: 0 }),
    body('closedByName').optional().isString().trim(),
    body('notes').optional().isString().trim().isLength({ max: 2000 })
  ],
  validateRequest,
  requirePermission(PERMISSION.SHIFT_CLOSE),
  closeShift
);

/** GET /shifts/active */
router.get(
  '/active',
  isAuthenticated,
  [
    query('branchId').optional().isString().trim(),
    query('openedBy').optional().isMongoId()
  ],
  validateRequest,
  requirePermission(PERMISSION.SHIFT_READ),
  getActiveShift
);

/** GET /shifts */
router.get(
  '/',
  isAuthenticated,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('branchId').optional().isString().trim(),
    query('status').optional().isIn(['open', 'closed'])
  ],
  validateRequest,
  requirePermission(PERMISSION.SHIFT_LIST),
  listShifts
);

/** GET /shifts/:id */
router.get(
  '/:id',
  isAuthenticated,
  [param('id').isMongoId().withMessage('Invalid shift id')],
  validateRequest,
  requirePermission(PERMISSION.SHIFT_READ),
  getShiftById
);

export default router;
