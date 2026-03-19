import { Router } from 'express';

import {
  createDrawer,
  getDrawerById,
  listDrawers
} from '../controllers/drawer.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';
import {
  createDrawerValidation,
  getDrawerByIdValidation,
  listDrawersValidation
} from '../validators/drawer.validators';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  createDrawerValidation,
  validateRequest,
  requirePermission(PERMISSION.DRAWER_CREATE),
  createDrawer
);

router.get(
  '/branch/:branchId',
  isAuthenticated,
  listDrawersValidation,
  validateRequest,
  requirePermission(PERMISSION.DRAWER_READ),
  listDrawers
);

router.get(
  '/:id',
  isAuthenticated,
  getDrawerByIdValidation,
  validateRequest,
  requirePermission(PERMISSION.DRAWER_READ),
  getDrawerById
);

export default router;
