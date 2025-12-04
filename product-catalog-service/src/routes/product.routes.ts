import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createProduct,
  getProductById,
  listProducts,
  deleteProduct
} from '../controllers/product.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validateRequest';
import { requirePermission } from '../middlewares/requirePermission';
import { PERMISSION } from '../helper/canPerformAction';

const router = Router();

/**
 * ============================
 * PRODUCT ROUTES
 * ============================
 * Base URL: /api/products
 *
 * 🔹 Create Product (POST /)
 * 🔹 Get All Products (GET /)
 * 🔹 Get Product by ID (GET /:id)
 * 🔹 Delete Product (DELETE /:id)
 *
 * 👉 Example Testing with Postman:
 *
 * 1. Create product:
 *    POST /api/products
 *    Body (JSON):
 *    {
 *      "name": "iPhone 15",
 *      "price": 1200,
 *      "stock": 20,
 *      "category": "65321abf123456...",
 *      "images": ["iphone.jpg"],
 *      "tags": ["Apple", "Smartphone"],
 *      "metaTitle": "iPhone 15 - Buy Online"
 *    }
 *
 * 2. List products:
 *    GET /api/product?page=1&limit=10&search=iphone
 *
 * 3. Get product by ID:
 *    GET /api/products/65321abf123456...
 *
 * 4. Delete product (soft delete):
 *    DELETE /api/products/65321abf123456...
 *
 * ============================
 */

/** POST /api/products */
router.post(
  '/create',
  isAuthenticated,
  [
    body('name')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 200 })
      .withMessage('name is required'),
    body('price').isNumeric().withMessage('price must be a number'),
    body('stock').isInt({ min: 0 }).withMessage('stock must be a non-negative integer'),
    body('category').isMongoId().withMessage('valid category id required'),
    body('slug').optional().isString().trim(),
    body('description').optional().isString().isLength({ max: 2000 }),
    body('discountPrice').optional().isNumeric(),
    body('sku').optional().isString().isLength({ max: 50 }),
    body('images').optional().isArray(),
    body('variants').optional().isArray(),
    body('metaTitle').optional().isString().isLength({ max: 60 }),
    body('metaDescription').optional().isString().isLength({ max: 160 }),
    body('tags').optional().isArray()
  ],
  validateRequest,
  requirePermission(PERMISSION.PRODUCT_CREATE),
  createProduct
);

/** GET /api/products */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('active').optional().isBoolean(),
    query('category').optional().isMongoId(),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'name', 'price']),
    query('sortOrder').optional().isIn(['asc', 'desc', '1', '-1'])
  ],
  validateRequest,
  listProducts
);

/** GET /api/products/:id */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid product id')],
  validateRequest,
  getProductById
);

/** DELETE /api/products/:id (soft delete) */
router.delete(
  '/:id',
  isAuthenticated,
  [param('id').isMongoId().withMessage('Invalid product id')],
  validateRequest,
  deleteProduct
);

export default router;
