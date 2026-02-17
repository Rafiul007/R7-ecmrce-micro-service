/**
 * @openapi
 * tags:
 *   - name: IAM Auth
 *     description: Authentication endpoints (via IAM service)
 *   - name: IAM Customer
 *     description: Customer profile endpoints (via IAM service)
 *   - name: IAM Employee
 *     description: Employee management endpoints (via IAM service)
 *   - name: Catalog Category
 *     description: Category endpoints (via Product Catalog service)
 *   - name: Catalog Product
 *     description: Product endpoints (via Product Catalog service)
 *   - name: Shift
 *     description: Shift and drawer endpoints (via Shift service)
 *   - name: Shift Cash
 *     description: Cash in/out endpoints (via Shift service)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     AuthRegisterRequest:
 *       type: object
 *       required: [fullName, email, password]
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Super Admin"
 *         email:
 *           type: string
 *           format: email
 *           example: "super-admin@gmail.com"
 *         password:
 *           type: string
 *           example: "123456"
 *         phone:
 *           type: string
 *           example: "0000001"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [user, admin, employee]
 *           example: ["admin"]
 *
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "super-admin@gmail.com"
 *         password:
 *           type: string
 *           example: "123456"
 *
 *     CategoryCreateRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: "Smartphones"
 *         description:
 *           type: string
 *           example: "Android and iOS mobile phones"
 *         parent:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     ProductCreateRequest:
 *       type: object
 *       required: [name, price, stock, category]
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro Max"
 *         description:
 *           type: string
 *           example: "6.7-inch OLED, A17 Pro, 48MP main camera."
 *         price:
 *           type: number
 *           example: 1299
 *         discountPrice:
 *           type: number
 *           example: 1199
 *         sku:
 *           type: string
 *           example: "IP15PM-256-BLU"
 *         stock:
 *           type: integer
 *           example: 30
 *         category:
 *           type: string
 *           description: Category id
 *           example: "67c06e080fbf1d2c6e3b9e12"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["ip15pm-front.jpg", "ip15pm-back.jpg"]
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Storage"
 *               value:
 *                 type: string
 *                 example: "256GB"
 *               additionalPrice:
 *                 type: number
 *                 example: 0
 *               stock:
 *                 type: integer
 *                 example: 10
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["apple", "ios", "5g", "flagship"]
 *
 *     EmployeePermissionsRequest:
 *       type: object
 *       required: [permissions]
 *       properties:
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["shift:list", "cash:movement:read"]
 *
 *     EmployeePermissionsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Employee permissions updated"
 *         data:
 *           type: object
 *           properties:
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["shift:open", "shift:close", "shift:read"]
 *
 *     EmployeePermissionsCatalogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Employee permissions fetched"
 *         data:
 *           type: object
 *           properties:
 *             basePermissions:
 *               type: array
 *               items:
 *                 type: string
 *             availablePermissions:
 *               type: array
 *               items:
 *                 type: string
 *
 *     ShiftOpenRequest:
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
 *
 *     ShiftCloseRequest:
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
 *
 *     CashMovementCreateRequest:
 *       type: object
 *       required: [shiftId, type, amount]
 *       properties:
 *         shiftId:
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
 *
 */

/**
 * @openapi
 * /iam/api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [IAM Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: User registered with access token
 */

/**
 * @openapi
 * /iam/api/auth/login:
 *   post:
 *     summary: Login and receive access token
 *     tags: [IAM Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @openapi
 * /iam/api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [IAM Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */

/**
 * @openapi
 * /iam/api/auth/logout:
 *   post:
 *     summary: Logout and clear refresh token cookie
 *     tags: [IAM Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */

/**
 * @openapi
 * /iam/api/customer/register:
 *   post:
 *     summary: Create customer profile
 *     tags: [IAM Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, address, gender, dateOfBirth]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               address:
 *                 type: object
 *                 required: [street, city, country]
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "House 12, Road 3"
 *                   city:
 *                     type: string
 *                     example: "Dhaka"
 *                   country:
 *                     type: string
 *                     example: "BD"
 *               customerType:
 *                 type: string
 *                 enum: [regular, vip, wholesale]
 *                 example: "vip"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "female"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1996-08-14"
 *     responses:
 *       201:
 *         description: Customer profile created
 */

/**
 * @openapi
 * /iam/api/staff/register:
 *   post:
 *     summary: Create employee profile (admin only)
 *     tags: [IAM Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - employeeType
 *               - phone
 *               - gender
 *               - dateOfBirth
 *               - emergencyContact
 *               - employmentType
 *               - designation
 *               - department
 *               - joiningDate
 *               - salary
 *               - salaryCurrency
 *               - salaryFrequency
 *             properties:
 *               email:
 *                 type: string
 *                 example: "manager1@example.com"
 *               employeeType:
 *                 type: string
 *                 enum: [manager, staff, delivery, support]
 *                 example: "manager"
 *               phone:
 *                 type: string
 *                 example: "+8801712340001"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               emergencyContact:
 *                 type: object
 *                 required: [name, phone, relation]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Rahman"
 *                   phone:
 *                     type: string
 *                     example: "+8801712345678"
 *                   relation:
 *                     type: string
 *                     example: "brother"
 *               employmentType:
 *                 type: string
 *                 enum: [full_time, part_time, contract, intern]
 *                 example: "full_time"
 *               designation:
 *                 type: string
 *                 example: "Store Manager"
 *               department:
 *                 type: string
 *                 example: "Retail"
 *               joiningDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-10"
 *               salary:
 *                 type: number
 *                 example: 65000
 *               salaryCurrency:
 *                 type: string
 *                 example: "BDT"
 *               salaryFrequency:
 *                 type: string
 *                 enum: [hourly, weekly, monthly]
 *                 example: "monthly"
 *     responses:
 *       201:
 *         description: Employee profile created
 */

/**
 * @openapi
 * /iam/api/staff:
 *   get:
 *     summary: List employees (admin only)
 *     tags: [IAM Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *     responses:
 *       200:
 *         description: Employee list fetched
 */

/**
 * @openapi
 * /iam/api/staff/{id}:
 *   get:
 *     summary: Get a single employee (admin only)
 *     tags: [IAM Employee]
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
 */

/**
 * @openapi
 * /iam/api/staff/permissions:
 *   get:
 *     summary: List available employee permissions (admin only)
 *     tags: [IAM Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee permissions catalog fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeePermissionsCatalogResponse'
 */

/**
 * @openapi
 * /iam/api/staff/{id}/permissions/add:
 *   patch:
 *     summary: Add permissions to employee (admin only)
 *     tags: [IAM Employee]
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
 *             $ref: '#/components/schemas/EmployeePermissionsRequest'
 *     responses:
 *       200:
 *         description: Employee permissions updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeePermissionsResponse'
 */

/**
 * @openapi
 * /iam/api/staff/{id}/permissions/remove:
 *   patch:
 *     summary: Remove permissions from employee (admin only)
 *     tags: [IAM Employee]
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
 *             $ref: '#/components/schemas/EmployeePermissionsRequest'
 *     responses:
 *       200:
 *         description: Employee permissions updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeePermissionsResponse'
 */

/**
 * @openapi
 * /product-catalog/categories/create:
 *   post:
 *     summary: Create category
 *     tags: [Catalog Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreateRequest'
 *     responses:
 *       201:
 *         description: Category created
 */

/**
 * @openapi
 * /product-catalog/categories:
 *   get:
 *     summary: List categories
 *     tags: [Catalog Category]
 *     responses:
 *       200:
 *         description: Categories fetched
 */

/**
 * @openapi
 * /product-catalog/categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Catalog Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category fetched
 */

/**
 * @openapi
 * /product-catalog/categories/{id}/toggle-active:
 *   patch:
 *     summary: Toggle category active status
 *     tags: [Catalog Category]
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
 *         description: Category status updated
 */

/**
 * @openapi
 * /product-catalog/products/create:
 *   post:
 *     summary: Create product
 *     tags: [Catalog Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @openapi
 * /product-catalog/products:
 *   get:
 *     summary: List products
 *     tags: [Catalog Product]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or tags (e.g., "Galaxy")
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *     responses:
 *       200:
 *         description: Products fetched
 */

/**
 * @openapi
 * /product-catalog/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Catalog Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched
 */

/**
 * @openapi
 * /product-catalog/products/{id}:
 *   delete:
 *     summary: Delete product (soft delete)
 *     tags: [Catalog Product]
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
 *         description: Product deleted
 */

/**
 * @openapi
 * /shift/shifts/open:
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
 *             $ref: '#/components/schemas/ShiftOpenRequest'
 *     responses:
 *       201:
 *         description: Shift opened
 */

/**
 * @openapi
 * /shift/shifts/{id}/close:
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
 *             $ref: '#/components/schemas/ShiftCloseRequest'
 *     responses:
 *       200:
 *         description: Shift closed
 */

/**
 * @openapi
 * /shift/shifts/active:
 *   get:
 *     summary: Get active shift
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
 * /shift/shifts:
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
 * /shift/shifts/{id}:
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

/**
 * @openapi
 * /shift/cash-movements:
 *   post:
 *     summary: Record cash in or cash out
 *     tags: [Shift Cash]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashMovementCreateRequest'
 *     responses:
 *       201:
 *         description: Cash movement created
 */

/**
 * @openapi
 * /shift/cash-movements:
 *   get:
 *     summary: List cash movements for a shift
 *     tags: [Shift Cash]
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
