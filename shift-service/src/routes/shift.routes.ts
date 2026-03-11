import { Router } from 'express';
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
import {
  closeShiftValidation,
  getActiveShiftValidation,
  getShiftByIdValidation,
  listShiftsValidation,
  openShiftValidation
} from '../validators/shift.validators';

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
  openShiftValidation,
  validateRequest,
  requirePermission(PERMISSION.SHIFT_OPEN),
  openShift
);

/** POST /shifts/:id/close */
router.post(
  '/:id/close',
  isAuthenticated,
  closeShiftValidation,
  validateRequest,
  requirePermission(PERMISSION.SHIFT_CLOSE),
  closeShift
);

/** GET /shifts/active */
router.get(
  '/active',
  isAuthenticated,
  getActiveShiftValidation,
  validateRequest,
  requirePermission(PERMISSION.SHIFT_READ),
  getActiveShift
);

/** GET /shifts */
router.get(
  '/',
  isAuthenticated,
  listShiftsValidation,
  validateRequest,
  requirePermission(PERMISSION.SHIFT_LIST),
  listShifts
);

/** GET /shifts/:id */
router.get(
  '/:id',
  isAuthenticated,
  getShiftByIdValidation,
  validateRequest,
  requirePermission(PERMISSION.SHIFT_READ),
  getShiftById
);

export default router;
