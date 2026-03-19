/**
 * @openapi
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a999"
 *         branchName:
 *           type: string
 *           example: "NYC Flagship"
 *         branchLocation:
 *           type: string
 *           example: "5th Avenue, Manhattan"
 *         branchManagerId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5b333"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-18T09:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-18T09:00:00.000Z"
 *
 *     CreateBranchRequest:
 *       type: object
 *       required: [branchName]
 *       properties:
 *         branchName:
 *           type: string
 *           example: "NYC Flagship"
 *         branchLocation:
 *           type: string
 *           example: "5th Avenue, Manhattan"
 *         branchManagerId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5b333"
 *
 *     BranchListResponse:
 *       type: object
 *       properties:
 *         branches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Branch'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 20
 *             total:
 *               type: integer
 *               example: 1
 *             pages:
 *               type: integer
 *               example: 1
 *
 *     Drawer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5c111"
 *         drawerName:
 *           type: string
 *           example: "Front Drawer 1"
 *         branchId:
 *           oneOf:
 *             - type: string
 *               example: "67d0c1f7a9f2a7d8a8f5a999"
 *             - $ref: '#/components/schemas/Branch'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-18T09:10:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-18T09:10:00.000Z"
 *
 *     CreateDrawerRequest:
 *       type: object
 *       required: [drawerName, branchId]
 *       properties:
 *         drawerName:
 *           type: string
 *           example: "Front Drawer 1"
 *         branchId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a999"
 *
 *     DrawerListResponse:
 *       type: object
 *       properties:
 *         drawers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Drawer'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 20
 *             total:
 *               type: integer
 *               example: 1
 *             pages:
 *               type: integer
 *               example: 1
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
 *           examples:
 *             nycBranch:
 *               summary: Create NYC branch
 *               value:
 *                 branchName: "NYC Flagship"
 *                 branchLocation: "5th Avenue, Manhattan"
 *                 branchManagerId: "67d0c1f7a9f2a7d8a8f5b333"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       409:
 *         description: Branch already exists
 *
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
 *               $ref: '#/components/schemas/Branch'
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
 *           examples:
 *             frontDrawer:
 *               summary: Create a front counter drawer
 *               value:
 *                 drawerName: "Front Drawer 1"
 *                 branchId: "67d0c1f7a9f2a7d8a8f5a999"
 *     responses:
 *       201:
 *         description: Drawer created successfully
 *       404:
 *         description: Branch not found
 *       409:
 *         description: Drawer already exists for this branch
 *
 */

/**
 * @openapi
 * /drawers/branch/{branchId}:
 *   get:
 *     summary: List all drawers for a branch
 *     description: Returns paginated drawers for one specific branch only.
 *     tags: [Drawer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch id whose drawers should be returned
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
 *               $ref: '#/components/schemas/Drawer'
 *       404:
 *         description: Drawer not found
 */
