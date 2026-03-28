/**
 * @openapi
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         branchName:
 *           type: string
 *           example: NYC Flagship
 *         branchLocation:
 *           type: string
 *           example: 5th Avenue, Manhattan
 *         branchManagerId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5b333"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateBranchRequest:
 *       type: object
 *       required: [branchName]
 *       properties:
 *         branchName:
 *           type: string
 *         branchLocation:
 *           type: string
 *         branchManagerId:
 *           type: string
 *     BranchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Branch fetched successfully
 *         data:
 *           $ref: '#/components/schemas/Branch'
 *     BranchListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Branches fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             branches:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
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
 *     Drawer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         drawerName:
 *           type: string
 *         branchId:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/Branch'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateDrawerRequest:
 *       type: object
 *       required: [drawerName, branchId]
 *       properties:
 *         drawerName:
 *           type: string
 *         branchId:
 *           type: string
 *     DrawerResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Drawer fetched successfully
 *         data:
 *           $ref: '#/components/schemas/Drawer'
 *     DrawerListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Branch drawers fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             drawers:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Drawer'
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
 *   - name: Branch
 *     description: Manage store branches used by shifts and drawers
 *   - name: Drawer
 *     description: Manage cash drawers assigned to branches
 */

/**
 * @openapi
 * /branches:
 *   post:
 *     summary: Create a branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBranchRequest'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BranchResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Branch created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Branch already exists
 *   get:
 *     summary: List branches
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branches fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchListResponse'
 */

/**
 * @openapi
 * /branches/{id}:
 *   get:
 *     summary: Get branch by id
 *     tags: [Branch]
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
 *         description: Branch fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid branch id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 */

/**
 * @openapi
 * /drawers:
 *   post:
 *     summary: Create a drawer
 *     description: Create a drawer under an existing branch.
 *     tags: [Drawer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDrawerRequest'
 *     responses:
 *       201:
 *         description: Drawer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/DrawerResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Drawer created successfully
 *       400:
 *         description: Validation error or invalid branch id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       409:
 *         description: Drawer already exists for this branch
 */

/**
 * @openapi
 * /drawers/branch/{branchId}:
 *   get:
 *     summary: List all drawers for a branch
 *     tags: [Drawer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch drawers fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrawerListResponse'
 *       400:
 *         description: Invalid branch id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 */

/**
 * @openapi
 * /drawers/{id}:
 *   get:
 *     summary: Get drawer by id
 *     tags: [Drawer]
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
 *         description: Drawer fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DrawerResponse'
 *       400:
 *         description: Invalid drawer id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Drawer not found
 */
