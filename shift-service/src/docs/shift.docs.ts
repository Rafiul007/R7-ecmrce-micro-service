/**
 * @openapi
 * components:
 *   schemas:
 *     Shift:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a111"
 *         branchId:
 *           type: string
 *           example: "NYC-01"
 *         branchName:
 *           type: string
 *           example: "Manhattan Flagship"
 *         employeeId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5b999"
 *         openedBy:
 *           type: string
 *           example: "67a111e2fbbdacb274d12f88"
 *         openedByName:
 *           type: string
 *           example: "Rafiul"
 *         openedAt:
 *           type: string
 *           format: date-time
 *         openingCash:
 *           type: number
 *           example: 10
 *         cashSalesTotal:
 *           type: number
 *           example: 0
 *         cashInTotal:
 *           type: number
 *           example: 0
 *         cashOutTotal:
 *           type: number
 *           example: 0
 *         expectedCash:
 *           type: number
 *           example: 10
 *         overShort:
 *           type: number
 *           example: 0
 *         status:
 *           type: string
 *           enum: [open, closed]
 *           example: open
 *         closedAt:
 *           type: string
 *           format: date-time
 *         closingCash:
 *           type: number
 *           example: 10
 *         notes:
 *           type: string
 *           example: "Morning shift"
 *
 *     OpenShiftRequest:
 *       type: object
 *       required: [branchId, branchName, openingCash]
 *       properties:
 *         branchId:
 *           type: string
 *           example: "NYC-01"
 *         branchName:
 *           type: string
 *           example: "Manhattan Flagship"
 *         openingCash:
 *           type: number
 *           example: 10
 *         openedByName:
 *           type: string
 *           example: "Rafiul"
 *         notes:
 *           type: string
 *           example: "Opening drawer"
 *
 *     CloseShiftRequest:
 *       type: object
 *       required: [closingCash]
 *       properties:
 *         closingCash:
 *           type: number
 *           example: 125.5
 *         cashSalesTotal:
 *           type: number
 *           example: 115.5
 *         closedByName:
 *           type: string
 *           example: "Rafiul"
 *         notes:
 *           type: string
 *           example: "Closed after reconciliation"
 *
 * tags:
 *   - name: Shift
 *     description: Shift open/close and drawer summary
 */

/**
 * @openapi
 * /shifts/open:
 *   post:
 *     summary: Open a new shift
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
 *         description: Shift opened
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
 *         description: Shift closed
 */

/**
 * @openapi
 * /shifts/active:
 *   get:
 *     summary: Get active shift by branch or user
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *       - in: query
 *         name: openedBy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active shift fetched
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
 *         description: Shift list fetched
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
 *         description: Shift fetched
 */
