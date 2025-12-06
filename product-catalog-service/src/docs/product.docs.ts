/**
 * @openapi
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Storage"
 *         value:
 *           type: string
 *           example: "256GB"
 *         additionalPrice:
 *           type: number
 *           example: 100
 *         stock:
 *           type: number
 *           example: 5
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67c080e2fbbdacb274d12f88"
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         slug:
 *           type: string
 *           example: "iphone-15-pro"
 *         description:
 *           type: string
 *           example: "Latest Apple flagship smartphone."
 *         price:
 *           type: number
 *           example: 1500
 *         discountPrice:
 *           type: number
 *           example: 1400
 *         sku:
 *           type: string
 *           example: "IPH15-PRO-256"
 *         stock:
 *           type: number
 *           example: 20
 *         category:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["iphone15.jpg"]
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Apple", "Smartphone", "Flagship"]
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         slug:
 *           type: string
 *           example: "iphone-15-pro"
 *         description:
 *           type: string
 *           example: "Apple's latest flagship smartphone"
 *         price:
 *           type: number
 *           example: 1500
 *         discountPrice:
 *           type: number
 *           example: 1400
 *         sku:
 *           type: string
 *           example: "IPH15-PRO"
 *         stock:
 *           type: number
 *           example: 50
 *         category:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["iphone.jpg"]
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["apple", "smartphone"]
 *         metaTitle:
 *           type: string
 *           example: "iPhone 15 Pro - Buy Online"
 *         metaDescription:
 *           type: string
 *           example: "Buy the Apple iPhone 15 Pro with improved chip and camera."
 *
 * tags:
 *   - name: Product
 *     description: APIs related to product management
 */

/**
 * @openapi
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — User does not have permission
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products with filtering, pagination and sorting
 *     tags: [Product]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search products by name or tags
 *       - name: active
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, price]
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - No permission
 *       404:
 *         description: Product not found
 */
