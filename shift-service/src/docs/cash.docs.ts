/**
 * @openapi
 * components:
 *   schemas:
 *     CashMovement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a222"
 *         shift:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a111"
 *         type:
 *           type: string
 *           enum: [in, out]
 *           example: in
 *         amount:
 *           type: number
 *           example: 20
 *         reason:
 *           type: string
 *           example: "Petty cash refill"
 *         createdByName:
 *           type: string
 *           example: "Rafiul"
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CashMovementRequest:
 *       type: object
 *       required: [shiftId, type, amount]
 *       properties:
 *         shiftId:
 *           type: string
 *           example: "67d0c1f7a9f2a7d8a8f5a111"
 *         type:
 *           type: string
 *           enum: [in, out]
 *           example: out
 *         amount:
 *           type: number
 *           example: 15
 *         reason:
 *           type: string
 *           example: "Cash payout"
 *         createdByName:
 *           type: string
 *           example: "Rafiul"
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
 */

/**
 * @openapi
 * /cash-movements:
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
 */
