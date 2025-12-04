import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createCategory,
  getCategoryById,
  listCategories,
  toggleActive
} from '../controllers/category.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';

const router = Router();

/**
 * POST /category
 * Body: { name: string; description?: string; parent?: string(ObjectId) }
 */
router.post(
  '/create',
  isAuthenticated,
  [
    body('name')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 120 })
      .withMessage('name is required and must be <= 120 chars'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .withMessage('description must be <= 1000 chars'),
    body('parent')
      .optional({ checkFalsy: true, nullable: true })
      .isMongoId()
      .withMessage('parent must be a valid ObjectId')
  ],
  validateRequest,
  requirePermission('category:create' ),
  createCategory
);

/**
 * GET /category (public)
 * Query:
 *  - search?: string
 *  - parent?: string | 'null' | 'root'
 *  - active?: 'true' | 'false'
 *  - page?: number
 *  - limit?: number (<=100)
 *  - sortBy?: 'createdAt'|'updatedAt'|'name'
 *  - sortOrder?: 'asc'|'desc'|'1'|'-1'
 *  - fields?: comma-separated whitelist
 *  - include?: 'childrenCount'
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit 1-100'),
    query('active').optional().isBoolean().withMessage('active must be boolean'),
    query('parent').optional().isString(),
    query('search').optional().isString().isLength({ max: 120 }).withMessage('search too long'),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'name']),
    query('sortOrder').optional().isIn(['asc', 'desc', '1', '-1']),
    query('fields').optional().isString(),
    query('include').optional().isString()
  ],
  validateRequest,
  listCategories
);

/** GET /category/:id (public) */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid id')],
  validateRequest,
  getCategoryById
);

/** PATCH /category/:id/toggle-active (auth) */
router.patch(
  '/:id/toggle-active',
  isAuthenticated,
  [param('id').isMongoId().withMessage('Invalid id')],
  validateRequest,
  toggleActive
);
export default router;
