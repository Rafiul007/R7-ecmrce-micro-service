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
 *     Dimensions:
 *       type: object
 *       properties:
 *         lengthCm:
 *           type: number
 *           example: 15
 *         widthCm:
 *           type: number
 *           example: 7
 *         heightCm:
 *           type: number
 *           example: 0.8
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         stock:
 *           type: number
 *         reorderLevel:
 *           type: number
 *         unit:
 *           type: string
 *         category:
 *           oneOf:
 *             - type: string
 *             - type: object
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         availableInStore:
 *           type: boolean
 *         availableOnline:
 *           type: boolean
 *         weightKg:
 *           type: number
 *         dimensions:
 *           $ref: '#/components/schemas/Dimensions'
 *         taxRate:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         metaTitle:
 *           type: string
 *         metaDescription:
 *           type: string
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProductRequest:
 *       type: object
 *       required: [name, price, stock, category]
 *       properties:
 *         name:
 *           type: string
 *           example: "Samsung Galaxy S24 Ultra"
 *         slug:
 *           type: string
 *           example: "samsung-galaxy-s24-ultra"
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           example: 1399
 *         discountPrice:
 *           type: number
 *           example: 1299
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         stock:
 *           type: integer
 *           example: 45
 *         reorderLevel:
 *           type: integer
 *         unit:
 *           type: string
 *         category:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         availableInStore:
 *           type: boolean
 *         availableOnline:
 *           type: boolean
 *         weightKg:
 *           type: number
 *         dimensions:
 *           $ref: '#/components/schemas/Dimensions'
 *         taxRate:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         metaTitle:
 *           type: string
 *         metaDescription:
 *           type: string
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Product fetched successfully
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Products fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
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
 *               allOf:
 *                 - $ref: '#/components/schemas/ProductResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Product created successfully
 *       400:
 *         description: Validation error, invalid category, or invalid discount price
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products with filtering, pagination, and sorting
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, price]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc, 1, -1]
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid product id
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       400:
 *         description: Invalid product id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
