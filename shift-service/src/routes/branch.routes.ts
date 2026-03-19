import { Router } from 'express';

import { createBranch, getBranchById, listBranches } from '../controllers/branch.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';
import {
  createBranchValidation,
  getBranchByIdValidation,
  listBranchesValidation
} from '../validators/branch.validators';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  createBranchValidation,
  validateRequest,
  requirePermission(PERMISSION.BRANCH_CREATE),
  createBranch
);

router.get(
  '/',
  isAuthenticated,
  listBranchesValidation,
  validateRequest,
  // requirePermission(PERMISSION.BRANCH_READ),
  listBranches
);

router.get(
  '/:id',
  isAuthenticated,
  getBranchByIdValidation,
  validateRequest,
  requirePermission(PERMISSION.BRANCH_READ),
  getBranchById
);

export default router;
