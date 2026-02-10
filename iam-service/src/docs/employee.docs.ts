/**
 * @openapi
 * components:
 *   schemas:
 *     EmergencyContact:
 *       type: object
 *       required: [name, phone, relation]
 *       properties:
 *         name:
 *           type: string
 *           example: "John Rahman"
 *         phone:
 *           type: string
 *           example: "+8801712345678"
 *         relation:
 *           type: string
 *           example: "brother"
 *
 *     EmployeeProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         userId:
 *           type: string
 *           example: "67bfdfb80bae4cb0f09a496b"
 *         employeeType:
 *           type: string
 *           enum: [manager, staff, delivery, support]
 *           example: "manager"
 *         phone:
 *           type: string
 *           example: "+8801712340001"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *         employmentType:
 *           type: string
 *           enum: [full_time, part_time, contract, intern]
 *           example: "full_time"
 *         designation:
 *           type: string
 *           example: "Store Manager"
 *         department:
 *           type: string
 *           example: "Retail"
 *         joiningDate:
 *           type: string
 *           format: date
 *           example: "2025-01-10"
 *         salary:
 *           type: number
 *           example: 65000
 *         salaryCurrency:
 *           type: string
 *           example: "BDT"
 *         salaryFrequency:
 *           type: string
 *           enum: [hourly, weekly, monthly]
 *           example: "monthly"
 *         employeeCode:
 *           type: string
 *           example: "RET-STR-M-4821"
 *         status:
 *           type: string
 *           enum: [active, suspended, terminated, resigned]
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateEmployeeRequest:
 *       type: object
 *       required:
 *         - email
 *         - employeeType
 *         - phone
 *         - gender
 *         - dateOfBirth
 *         - emergencyContact
 *         - employmentType
 *         - designation
 *         - department
 *         - joiningDate
 *         - salary
 *         - salaryCurrency
 *         - salaryFrequency
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email of an existing user
 *           example: "manager1@example.com"
 *         employeeType:
 *           type: string
 *           enum: [manager, staff, delivery, support]
 *           example: "manager"
 *         phone:
 *           type: string
 *           example: "+8801712340001"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *         employmentType:
 *           type: string
 *           enum: [full_time, part_time, contract, intern]
 *           example: "full_time"
 *         designation:
 *           type: string
 *           example: "Store Manager"
 *         department:
 *           type: string
 *           example: "Retail"
 *         joiningDate:
 *           type: string
 *           format: date
 *           example: "2025-01-10"
 *         salary:
 *           type: number
 *           example: 65000
 *         salaryCurrency:
 *           type: string
 *           example: "BDT"
 *         salaryFrequency:
 *           type: string
 *           enum: [hourly, weekly, monthly]
 *           example: "monthly"
 *         bankAccount:
 *           type: string
 *           example: "1234567890"
 *         taxId:
 *           type: string
 *           example: "TIN-123456"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["orders:read", "inventory:read"]
 *         systemAccessLevel:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "medium"
 *
 *     EmployeeProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Employee profile created"
 *         data:
 *           $ref: '#/components/schemas/EmployeeProfile'
 *
 * tags:
 *   - name: Employee
 *     description: Employee management APIs (admin only)
 */

/**
 * @openapi
 * /api/staff/register:
 *   post:
 *     summary: Create an employee profile
 *     description: Admin creates an employee profile for an existing user.
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Employee profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeProfileResponse'
 *       400:
 *         description: Validation error or missing fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin can create employee profiles
 *       404:
 *         description: User does not exist
 */

/**
 * @openapi
 * /api/staff:
 *   get:
 *     summary: List employees
 *     description: Admin-only list of employees with optional filters and pagination.
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           example: "Retail"
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *           example: "Store Manager"
 *     responses:
 *       200:
 *         description: Employee list fetched
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
 *                   example: "Employee list fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmployeeProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin can view employee list
 */

/**
 * @openapi
 * /api/staff/{id}:
 *   get:
 *     summary: Get a single employee
 *     description: Admin-only view of a single employee by ID.
 *     tags: [Employee]
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
 *         description: Employee details fetched
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
 *                   example: "Employee details fetched"
 *                 data:
 *                   $ref: '#/components/schemas/EmployeeProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin can view employee details
 *       404:
 *         description: Employee not found
 */
