/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         name:
 *           type: string
 *           example: "Electronics"
 *         slug:
 *           type: string
 *           example: "electronics"
 *         description:
 *           type: string
 *           example: "All electronic and smart devices"
 *         parent:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdBy:
 *           type: string
 *           example: "67bfdfb80bae4cb0f09a496b"
 *         updatedBy:
 *           type: string
 *           example: "67bfdfb80bae4cb0f09a496b"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Mobiles"
 *         description:
 *           type: string
 *           example: "Latest smartphones"
 *         parent:
 *           type: string
 *           nullable: true
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category created successfully"
 *         data:
 *           $ref: '#/components/schemas/Category'
 *
 *     CategoryPaginationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Categories fetched"
 *         data:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: number
 *                   example: 1
 *                 limit:
 *                   type: number
 *                   example: 20
 *                 total:
 *                   type: number
 *                   example: 52
 *                 pages:
 *                   type: number
 *                   example: 3
 *
 * tags:
 *   - name: Category
 *     description: Category management APIs
 */

/**
 * @openapi
 * /api/category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Missing Permission
 */

/**
 * @openapi
 * /api/category:
 *   get:
 *     summary: Get all categories (supports filtering, sorting, pagination)
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or slug
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter by parent category id or 'root'
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter active/inactive categories
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc, 1, -1]
 *
 *     responses:
 *       200:
 *         description: Category list returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryPaginationResponse'
 */

/**
 * @openapi
 * /api/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Category not found
 */

/**
 * @openapi
 * /api/category/{id}/toggle-active:
 *   patch:
 *     summary: Toggle the active status of a category
 *     tags: [Category]
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
 *         description: Status changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - No permission
 */
