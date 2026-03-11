import { Router } from 'express';
import {
  createCashMovement,
  listCashMovements
} from '../controllers/cashMovement.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';
import {
  createCashMovementValidation,
  listCashMovementsValidation
} from '../validators/cashMovement.validators';

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
  createCashMovementValidation,
  validateRequest,
  requirePermission(PERMISSION.CASH_MOVEMENT_CREATE),
  createCashMovement
);

/** GET /cash-movements */
router.get(
  '/',
  isAuthenticated,
  listCashMovementsValidation,
  validateRequest,
  requirePermission(PERMISSION.CASH_MOVEMENT_READ),
  listCashMovements
);

export default router;
