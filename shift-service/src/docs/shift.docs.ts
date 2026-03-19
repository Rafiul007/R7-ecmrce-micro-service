/**
 * @openapi
 * components:
 *   schemas:
 *     ShiftBranch:
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
 *     ShiftDrawer:
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
 *     Shift:
 *       type: object
 *       description: |
 *         A shift belongs to one drawer inside a branch.
 *         A branch can have multiple drawers, but each drawer can only have one open shift at a time.
 *       properties:
 *         _id:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a111"
 *         branch:
 *           $ref: '#/components/schemas/ShiftBranch'
 *         drawer:
 *           $ref: '#/components/schemas/ShiftDrawer'
 *         openedBy:
 *           type: string
 *           example: "67a111e2fbbdacb274d12f88"
 *         openedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-11T09:00:00.000Z"
 *         openingCash:
 *           type: number
 *           example: 150
 *         cashSalesTotal:
 *           type: number
 *           example: 340.75
 *         cashInTotal:
 *           type: number
 *           example: 20
 *         cashOutTotal:
 *           type: number
 *           example: 15
 *         closingCash:
 *           type: number
 *           example: 495.75
 *         closedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-11T17:00:00.000Z"
 *         closedBy:
 *           type: string
 *           example: "67a111e2fbbdacb274d12f88"
 *         expectedCash:
 *           type: number
 *           example: 495.75
 *         overShort:
 *           type: number
 *           example: 0
 *         status:
 *           type: string
 *           enum: [open, closed]
 *           example: open
 *         notes:
 *           type: string
 *           example: "Opening shift for front sales counter"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-11T09:00:01.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-11T17:00:01.000Z"
 *
 *     OpenShiftRequest:
 *       type: object
 *       required: [branchName, drawerId, openingCash]
 *       description: |
 *         Opens a shift for a specific drawer in a branch.
 *         Branches and drawers can be created ahead of time through the `/branches` and `/drawers` endpoints.
 *         Send the unique branch name and the drawer id.
 *         The service loads the full branch and drawer details from the database automatically.
 *       properties:
 *         branchName:
 *           type: string
 *           example: "NYC Flagship"
 *         drawerId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5c111"
 *         openingCash:
 *           type: number
 *           example: 150
 *         notes:
 *           type: string
 *           example: "Opening drawer before store launch"
 *
 *     CloseShiftRequest:
 *       type: object
 *       required: [closingCash]
 *       description: |
 *         Closes the selected open shift.
 *         `cashSalesTotal` is optional. If not provided, the service keeps the current accumulated sales total.
 *       properties:
 *         closingCash:
 *           type: number
 *           example: 495.75
 *         cashSalesTotal:
 *           type: number
 *           example: 340.75
 *         notes:
 *           type: string
 *           example: "Closed after reconciliation"
 *
 *     ShiftListResponse:
 *       type: object
 *       properties:
 *         shifts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Shift'
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
 *               example: 2
 *             pages:
 *               type: integer
 *               example: 1
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
 *     description: |
 *       Use this endpoint when an employee starts working on a drawer.
 *       Create branch and drawer records first if they do not already exist.
 *       Business rules enforced by the service:
 *       - A branch can have multiple drawers.
 *       - Each drawer can only have one open shift at a time.
 *       - A user can only have one open shift at a time.
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpenShiftRequest'
 *           examples:
 *             openNycDrawer:
 *               summary: Open front drawer 1 in NYC branch
 *               value:
 *                 branchName: "NYC Flagship"
 *                 drawerId: "67d0c1f7a9f2a7d8a8f5c111"
 *                 openingCash: 150
 *                 notes: "Opening drawer before store launch"
 *     responses:
 *       201:
 *         description: Shift opened successfully
 *       409:
 *         description: There is already an open shift for this drawer, or the user already has an open shift
 */

/**
 * @openapi
 * /shifts/{id}/close:
 *   post:
 *     summary: Close an open shift
 *     description: |
 *       Use this endpoint to reconcile and close a specific shift.
 *       The service computes `expectedCash` and `overShort` from opening cash, sales, cash-in, cash-out, and closing cash.
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
 *           examples:
 *             closeShift:
 *               summary: Close shift after drawer reconciliation
 *               value:
 *                 closingCash: 495.75
 *                 cashSalesTotal: 340.75
 *                 notes: "Closed after end-of-day reconciliation"
 *     responses:
 *       200:
 *         description: Shift closed successfully
 *       409:
 *         description: Shift is already closed
 */

/**
 * @openapi
 * /shifts/active:
 *   get:
 *     summary: Get an active shift by user or by drawer
 *     description: |
 *       Tester guidance:
 *       - Use `openedBy` to find the active shift for a user.
 *       - Use `branchId` and `drawerName` together to find the active shift for a drawer.
 *       - Do not send only `branchId`, because a branch may have multiple drawers with active shifts.
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Required together with `drawerName` when searching by drawer
 *       - in: query
 *         name: drawerName
 *         schema:
 *           type: string
 *         description: Required together with `branchId` when searching by drawer
 *       - in: query
 *         name: openedBy
 *         schema:
 *           type: string
 *         description: Use this to get the current open shift for a specific user
 *     responses:
 *       200:
 *         description: Active shift fetched successfully
 *       400:
 *         description: Missing or invalid query combination
 */

/**
 * @openapi
 * /shifts:
 *   get:
 *     summary: List shifts
 *     description: |
 *       Returns paginated shifts.
 *       You can filter by branch, by drawer inside a branch, and by shift status.
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter shifts for a branch
 *       - in: query
 *         name: drawerName
 *         schema:
 *           type: string
 *         description: Filter shifts for a specific drawer. Must be used with `branchId`.
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
 *       404:
 *         description: Shift not found
 */
