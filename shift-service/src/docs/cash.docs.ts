/**
 * @openapi
 * components:
 *   schemas:
 *     CashMovement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         shift:
 *           type: string
 *         type:
 *           type: string
 *           enum: [in, out]
 *         amount:
 *           type: number
 *         reason:
 *           type: string
 *         createdBy:
 *           type: string
 *         createdByName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CashMovementRequest:
 *       type: object
 *       required: [shiftId, type, amount]
 *       properties:
 *         shiftId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [in, out]
 *         amount:
 *           type: number
 *           minimum: 0.01
 *         reason:
 *           type: string
 *         createdByName:
 *           type: string
 *     CashMovementCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Cash movement recorded successfully
 *         data:
 *           type: object
 *           properties:
 *             movement:
 *               $ref: '#/components/schemas/CashMovement'
 *             shiftSummary:
 *               type: object
 *               properties:
 *                 cashInTotal:
 *                   type: number
 *                 cashOutTotal:
 *                   type: number
 *                 expectedCash:
 *                   type: number
 *     CashMovementListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Cash movements fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             movements:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashMovement'
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
 *   - name: Cash Movement
 *     description: Cash in/out operations for a shift
 */

/**
 * @openapi
 * /cash-movements:
 *   post:
 *     summary: Record cash in or cash out
 *     tags: [Cash Movement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashMovementRequest'
 *     responses:
 *       201:
 *         description: Cash movement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashMovementCreateResponse'
 *       400:
 *         description: Validation error or invalid shift id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shift not found
 *       409:
 *         description: Cannot add movement to a closed shift
 *   get:
 *     summary: List cash movements for a shift
 *     tags: [Cash Movement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shiftId
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
 *         description: Cash movements fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashMovementListResponse'
 *       400:
 *         description: Missing or invalid shift id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
