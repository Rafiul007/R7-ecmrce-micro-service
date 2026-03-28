/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
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
 *         parent:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         createdBy:
 *           type: string
 *         updatedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCategoryRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphones
 *         description:
 *           type: string
 *         parent:
 *           type: string
 *           nullable: true
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Category fetched
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     CategoryPaginationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Categories fetched
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
 *                 limit:
 *                   type: number
 *                 total:
 *                   type: number
 *                 pages:
 *                   type: number
 *
 * tags:
 *   - name: Category
 *     description: Category management APIs
 */

/**
 * @openapi
 * /categories/create:
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
 *               allOf:
 *                 - $ref: '#/components/schemas/CategoryResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Category created successfully
 *       400:
 *         description: Validation error, invalid parent id, or duplicate category
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Parent category not found
 */

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Parent category id, or one of `root`, `null`, or an empty string for top-level categories.
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
 *           enum: [createdAt, updatedAt, name]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc, 1, -1]
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated field whitelist.
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: Supports `childrenCount`.
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
 * /categories/{id}:
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
 *       400:
 *         description: Invalid category id
 *       404:
 *         description: Category not found
 */

/**
 * @openapi
 * /categories/{id}/toggle-active:
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
 *         description: Category status changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Invalid category id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
