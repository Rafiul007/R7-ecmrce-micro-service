/**
 * @openapi
 * components:
 *   schemas:
 *     ShiftBranch:
 *       type: object
 *       properties:
 *         branchName:
 *           type: string
 *         branchLocation:
 *           type: string
 *         branchManagerId:
 *           type: string
 *     ShiftDrawer:
 *       type: object
 *       properties:
 *         drawerName:
 *           type: string
 *         branchId:
 *           type: string
 *     Shift:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         branch:
 *           $ref: '#/components/schemas/ShiftBranch'
 *         drawer:
 *           $ref: '#/components/schemas/ShiftDrawer'
 *         openedBy:
 *           type: string
 *         openedAt:
 *           type: string
 *           format: date-time
 *         openingCash:
 *           type: number
 *         cashSalesTotal:
 *           type: number
 *         cashInTotal:
 *           type: number
 *         cashOutTotal:
 *           type: number
 *         closingCash:
 *           type: number
 *         closedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         closedBy:
 *           type: string
 *           nullable: true
 *         expectedCash:
 *           type: number
 *         overShort:
 *           type: number
 *         status:
 *           type: string
 *           enum: [open, closed]
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OpenShiftRequest:
 *       type: object
 *       required: [branchName, drawerId, openingCash]
 *       properties:
 *         branchName:
 *           type: string
 *           example: NYC Flagship
 *         drawerId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5c111"
 *         openingCash:
 *           type: number
 *           example: 150
 *         notes:
 *           type: string
 *           example: Opening drawer before store launch
 *     CloseShiftRequest:
 *       type: object
 *       required: [closingCash]
 *       properties:
 *         closingCash:
 *           type: number
 *           example: 495.75
 *         cashSalesTotal:
 *           type: number
 *           example: 340.75
 *         notes:
 *           type: string
 *           example: Closed after reconciliation
 *     ShiftResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Shift fetched successfully
 *         data:
 *           $ref: '#/components/schemas/Shift'
 *     ShiftListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Shifts fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             shifts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shift'
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
 *   - name: Shift
 *     description: Manage drawer-based sales shifts inside branches
 */

/**
 * @openapi
 * /shifts/open:
 *   post:
 *     summary: Open a new shift for a specific drawer
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpenShiftRequest'
 *     responses:
 *       201:
 *         description: Shift opened successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ShiftResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Shift opened successfully
 *       400:
 *         description: Validation error or drawer does not belong to branch
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch or drawer not found
 *       409:
 *         description: An open shift already exists for the drawer or the user
 */

/**
 * @openapi
 * /shifts/{id}/close:
 *   post:
 *     summary: Close an open shift
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CloseShiftRequest'
 *     responses:
 *       200:
 *         description: Shift closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ShiftResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Shift closed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shift not found
 *       409:
 *         description: Shift already closed
 */

/**
 * @openapi
 * /shifts/active:
 *   get:
 *     summary: Get an active shift by user or by drawer
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *       - in: query
 *         name: drawerName
 *         schema:
 *           type: string
 *       - in: query
 *         name: openedBy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active shift fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ShiftResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Active shift fetched successfully
 *       400:
 *         description: Missing or invalid query combination
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Active shift not found
 */

/**
 * @openapi
 * /shifts:
 *   get:
 *     summary: List shifts
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *       - in: query
 *         name: drawerName
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
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
 *         description: Shift list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftListResponse'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /shifts/{id}:
 *   get:
 *     summary: Get shift by id
 *     tags: [Shift]
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
 *         description: Shift fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftResponse'
 *       400:
 *         description: Invalid shift id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shift not found
 */
