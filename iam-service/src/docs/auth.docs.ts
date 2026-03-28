/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT access token for API authentication
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 *       description: HTTP-only refresh token cookie
 *   schemas:
 *     AuthTokenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: User registered
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid credentials
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *
 * tags:
 *   - name: Authentication
 *     description: Authentication endpoints
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user, returns an access token, and sets a refresh token cookie.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 1
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: SecureP@ss123
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               roles:
 *                 type: array
 *                 description: Optional user roles. Defaults to ["user"] when omitted.
 *                 items:
 *                   type: string
 *                   enum: [user, admin, employee]
 *                 example: ["admin"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       400:
 *         description: Validation failed, missing fields, or email already registered
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and receive authentication tokens
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: SecureP@ss123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AuthTokenResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Logged in
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using the refresh token cookie and rotates the refresh token.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AuthTokenResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Token refreshed
 *       401:
 *         description: Refresh token missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears the refresh token cookie.
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *                   example: Logged out
 */
