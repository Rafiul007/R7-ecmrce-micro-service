/**
 * @openapi
 * tags:
 *   - name: IAM Auth
 *     description: Authentication endpoints proxied to the IAM service
 *   - name: IAM Customer
 *     description: Customer profile endpoints proxied to the IAM service
 *   - name: IAM Employee
 *     description: Employee management endpoints proxied to the IAM service
 *   - name: Catalog Category
 *     description: Category endpoints proxied to the Product Catalog service
 *   - name: Catalog Product
 *     description: Product endpoints proxied to the Product Catalog service
 *   - name: Shift Branch
 *     description: Branch and drawer endpoints proxied to the Shift service
 *   - name: Shift
 *     description: Shift endpoints proxied to the Shift service
 *   - name: Shift Cash
 *     description: Cash movement endpoints proxied to the Shift service
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AuthRegisterRequest:
 *       type: object
 *       required: [fullName, email, password]
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         phone:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [user, admin, employee]
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     CustomerCreateRequest:
 *       type: object
 *       required: [email, address, gender, dateOfBirth]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: object
 *           required: [street, city, country]
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         customerType:
 *           type: string
 *           enum: [regular, vip, wholesale]
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         dateOfBirth:
 *           type: string
 *           format: date
 *     EmployeePermissionsRequest:
 *       type: object
 *       required: [permissions]
 *       properties:
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *     EmployeeCreateRequest:
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
 *         employeeType:
 *           type: string
 *           enum: [manager, staff, delivery, support]
 *         phone:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         address:
 *           type: object
 *         emergencyContact:
 *           type: object
 *           required: [name, phone, relation]
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *             relation:
 *               type: string
 *         employmentType:
 *           type: string
 *           enum: [full_time, part_time, contract, intern]
 *         designation:
 *           type: string
 *         department:
 *           type: string
 *         joiningDate:
 *           type: string
 *           format: date
 *         salary:
 *           type: number
 *         salaryCurrency:
 *           type: string
 *         salaryFrequency:
 *           type: string
 *           enum: [hourly, weekly, monthly]
 *         bankAccount:
 *           type: string
 *         taxId:
 *           type: string
 *         isSalaryFrozen:
 *           type: boolean
 *         supervisor:
 *           type: string
 *         systemAccessLevel:
 *           type: string
 *         isSupervisor:
 *           type: boolean
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         performanceRating:
 *           type: number
 *         lastPromotionDate:
 *           type: string
 *           format: date
 *         workShift:
 *           type: string
 *         leaveBalance:
 *           type: number
 *     CategoryCreateRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         parent:
 *           type: string
 *           nullable: true
 *     ProductCreateRequest:
 *       type: object
 *       required: [name, price, stock, category]
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         stock:
 *           type: integer
 *         reorderLevel:
 *           type: integer
 *         unit:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *         availableInStore:
 *           type: boolean
 *         availableOnline:
 *           type: boolean
 *         weightKg:
 *           type: number
 *         dimensions:
 *           type: object
 *         taxRate:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         metaTitle:
 *           type: string
 *         metaDescription:
 *           type: string
 *     CreateBranchRequest:
 *       type: object
 *       required: [branchName]
 *       properties:
 *         branchName:
 *           type: string
 *         branchLocation:
 *           type: string
 *         branchManagerId:
 *           type: string
 *     CreateDrawerRequest:
 *       type: object
 *       required: [drawerName, branchId]
 *       properties:
 *         drawerName:
 *           type: string
 *         branchId:
 *           type: string
 *     ShiftOpenRequest:
 *       type: object
 *       required: [branchName, drawerId, openingCash]
 *       properties:
 *         branchName:
 *           type: string
 *         drawerId:
 *           type: string
 *         openingCash:
 *           type: number
 *         notes:
 *           type: string
 *     ShiftCloseRequest:
 *       type: object
 *       required: [closingCash]
 *       properties:
 *         closingCash:
 *           type: number
 *         cashSalesTotal:
 *           type: number
 *         notes:
 *           type: string
 *     CashMovementCreateRequest:
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
 *             $ref: '#/components/schemas/CustomerCreateRequest'
 *     responses:
 *       201:
 *         description: Customer profile created
 */

/**
 * @openapi
 * /iam/api/staff/register:
 *   post:
 *     summary: Create employee profile
 *     tags: [IAM Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeCreateRequest'
 *     responses:
 *       201:
 *         description: Employee profile created
 */

/**
 * @openapi
 * /iam/api/staff:
 *   get:
 *     summary: List employees
 *     tags: [IAM Employee]
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
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee list fetched
 */

/**
 * @openapi
 * /iam/api/staff/{id}:
 *   get:
 *     summary: Get a single employee
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
 *     summary: List available employee permissions
 *     tags: [IAM Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee permissions catalog fetched
 */

/**
 * @openapi
 * /iam/api/staff/{id}/permissions/add:
 *   patch:
 *     summary: Add permissions to employee
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
 */

/**
 * @openapi
 * /iam/api/staff/{id}/permissions/remove:
 *   patch:
 *     summary: Remove permissions from employee
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
 *   delete:
 *     summary: Delete product
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
 * /shift/branches:
 *   post:
 *     summary: Create branch
 *     tags: [Shift Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBranchRequest'
 *     responses:
 *       201:
 *         description: Branch created
 *   get:
 *     summary: List branches
 *     tags: [Shift Branch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branches fetched
 */

/**
 * @openapi
 * /shift/branches/{id}:
 *   get:
 *     summary: Get branch by id
 *     tags: [Shift Branch]
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
 *         description: Branch fetched
 */

/**
 * @openapi
 * /shift/drawers:
 *   post:
 *     summary: Create drawer
 *     tags: [Shift Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDrawerRequest'
 *     responses:
 *       201:
 *         description: Drawer created
 */

/**
 * @openapi
 * /shift/drawers/branch/{branchId}:
 *   get:
 *     summary: List drawers for a branch
 *     tags: [Shift Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drawers fetched
 */

/**
 * @openapi
 * /shift/drawers/{id}:
 *   get:
 *     summary: Get drawer by id
 *     tags: [Shift Branch]
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
 *         description: Drawer fetched
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
 *         name: drawerName
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
 *         name: drawerName
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
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
 *     responses:
 *       200:
 *         description: Cash movements fetched
 */
