/**
 * @openapi
 * components:
 *   schemas:
 *     CustomerAddress:
 *       type: object
 *       required: [street, city, country]
 *       properties:
 *         street:
 *           type: string
 *           example: "House 12, Road 3"
 *         city:
 *           type: string
 *           example: "Dhaka"
 *         state:
 *           type: string
 *           example: "Dhaka"
 *         zipCode:
 *           type: string
 *           example: "1207"
 *         country:
 *           type: string
 *           example: "BD"
 *
 *     CustomerProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         userId:
 *           type: string
 *           example: "67bfdfb80bae4cb0f09a496b"
 *         customerType:
 *           type: string
 *           enum: [regular, vip, wholesale]
 *           example: "regular"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "female"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1996-08-14"
 *         address:
 *           $ref: '#/components/schemas/CustomerAddress'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCustomerRequest:
 *       type: object
 *       required: [email, address, gender, dateOfBirth]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email of an existing user
 *           example: "jane.doe@example.com"
 *         address:
 *           $ref: '#/components/schemas/CustomerAddress'
 *         customerType:
 *           type: string
 *           enum: [regular, vip, wholesale]
 *           example: "vip"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "female"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1996-08-14"
 *
 *     CustomerProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Customer profile created"
 *         data:
 *           $ref: '#/components/schemas/CustomerProfile'
 *
 * tags:
 *   - name: Customer
 *     description: Customer profile APIs
 */

/**
 * @openapi
 * /api/customer/register:
 *   post:
 *     summary: Create a customer profile
 *     description: Create a customer profile for an existing user by email.
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerRequest'
 *     responses:
 *       201:
 *         description: Customer profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerProfileResponse'
 *       400:
 *         description: Validation error or incomplete address
 *       404:
 *         description: User not found
 */
