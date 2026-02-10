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
 *     Dimensions:
 *       type: object
 *       properties:
 *         lengthCm:
 *           type: number
 *           example: 15.0
 *         widthCm:
 *           type: number
 *           example: 7.0
 *         heightCm:
 *           type: number
 *           example: 0.8
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67c080e2fbbdacb274d12f88"
 *         name:
 *           type: string
 *           example: "Samsung Galaxy S24 Ultra"
 *         slug:
 *           type: string
 *           example: "samsung-galaxy-s24-ultra"
 *         description:
 *           type: string
 *           example: "6.8-inch QHD+ display, Snapdragon 8 Gen 3, 200MP camera."
 *         price:
 *           type: number
 *           example: 1399
 *         discountPrice:
 *           type: number
 *           example: 1299
 *         sku:
 *           type: string
 *           example: "S24U-512-BLK"
 *         barcode:
 *           type: string
 *           example: "8806095451234"
 *         stock:
 *           type: number
 *           example: 45
 *         reorderLevel:
 *           type: number
 *           example: 10
 *         unit:
 *           type: string
 *           example: "pcs"
 *         category:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["s24-ultra-front.jpg", "s24-ultra-back.jpg"]
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         availableInStore:
 *           type: boolean
 *           example: true
 *         availableOnline:
 *           type: boolean
 *           example: true
 *         weightKg:
 *           type: number
 *           example: 0.232
 *         dimensions:
 *           $ref: '#/components/schemas/Dimensions'
 *         taxRate:
 *           type: number
 *           example: 10
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Samsung", "Android", "5G", "Flagship"]
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
 *           example: "Samsung Galaxy S24 Ultra"
 *         slug:
 *           type: string
 *           example: "samsung-galaxy-s24-ultra"
 *         description:
 *           type: string
 *           example: "6.8-inch QHD+ display, Snapdragon 8 Gen 3, 200MP camera."
 *         price:
 *           type: number
 *           example: 1399
 *         discountPrice:
 *           type: number
 *           example: 1299
 *         sku:
 *           type: string
 *           example: "S24U-512-BLK"
 *         barcode:
 *           type: string
 *           example: "8806095451234"
 *         stock:
 *           type: number
 *           example: 45
 *         reorderLevel:
 *           type: number
 *           example: 10
 *         unit:
 *           type: string
 *           example: "pcs"
 *         category:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["s24-ultra-front.jpg", "s24-ultra-back.jpg"]
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         availableInStore:
 *           type: boolean
 *           example: true
 *         availableOnline:
 *           type: boolean
 *           example: true
 *         weightKg:
 *           type: number
 *           example: 0.232
 *         dimensions:
 *           $ref: '#/components/schemas/Dimensions'
 *         taxRate:
 *           type: number
 *           example: 10
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["samsung", "android", "5g", "flagship"]
 *         metaTitle:
 *           type: string
 *           example: "Samsung Galaxy S24 Ultra - Buy Online"
 *         metaDescription:
 *           type: string
 *           example: "Order the Galaxy S24 Ultra with 200MP camera and fast performance."
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Products fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 20
 *                         total:
 *                           type: integer
 *                           example: 120
 *                         pages:
 *                           type: integer
 *                           example: 6
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
