import { Router } from 'express';
import { body } from 'express-validator';
import { createCategory } from '../controllers/category.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

/**
 * POST /category
 * Body: { name: string; description?: string; parent?: string(ObjectId) }
 */
router.post(
  '/',
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
  createCategory
);

export default router;
