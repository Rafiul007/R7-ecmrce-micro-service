import { EmployeeProfile, EmployeeType } from '../models/employeeModel';
import { User, UserRole } from '../models/userModel';
import { AuthRequest } from '../types/auth-request';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import {
  ALL_EMPLOYEE_PERMISSIONS,
  BASE_EMPLOYEE_PERMISSIONS,
  isValidEmployeePermission,
  normalizePermissions
} from '../helper/employeePermissions';

export const generateEmployeeCode = (
  designation: string,
  department: string,
  gender: string
): string => {
  const dep = department.slice(0, 3).toUpperCase();
  const des = designation.slice(0, 3).toUpperCase();
  const gen = gender.charAt(0).toUpperCase();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `${dep}-${des}-${gen}-${random}`;
};

export const createEmployeeProfile = asyncHandler(async (req: AuthRequest, res) => {
  // 1. MUST have req.user from token
  const admin = req.user;
  if (!admin) {
    throw new AppError('Unauthorized: No user in request', 401);
  }

  // 2. Only admin can create
  if (admin.role !== 'admin') {
    throw new AppError('Only admin can create employee profiles', 403);
  }

  const {
    email,
    employeeType,
    phone,
    gender,
    dateOfBirth,
    address,
    emergencyContact,
    employmentType,
    designation,
    department,
    joiningDate,
    salary,
    salaryCurrency,
    salaryFrequency,
    bankAccount,
    taxId,
    isSalaryFrozen,
    supervisor,
    systemAccessLevel,
    isSupervisor,
    skills,
    performanceRating,
    lastPromotionDate,
    workShift,
    leaveBalance
  } = req.body;

  // 3. Validate required fields (deep check)
  if (
    !email ||
    !employeeType ||
    !phone ||
    !gender ||
    !dateOfBirth ||
    !employmentType ||
    !designation ||
    !department ||
    !joiningDate ||
    !salary ||
    !salaryCurrency ||
    !salaryFrequency ||
    !emergencyContact ||
    !emergencyContact.name ||
    !emergencyContact.phone ||
    !emergencyContact.relation
  ) {
    throw new AppError('Missing required fields', 400);
  }

  // 4. Validate employeeType
  if (!Object.values(EmployeeType).includes(employeeType)) {
    throw new AppError('Invalid employeeType', 400);
  }

  // 5. Ensure user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User does not exist', 404);
  }

  // 6. One employee profile per user
  const existing = await EmployeeProfile.findOne({ userId: user._id });
  if (existing) {
    throw new AppError('Employee profile already exists for this user', 400);
  }

  // 7. Create the employee profile
  const profile = await EmployeeProfile.create({
    userId: user._id,
    employeeType,
    phone,
    gender,
    dateOfBirth,
    address,
    emergencyContact,
    employeeCode: generateEmployeeCode(designation, department, gender),
    employmentType,
    designation,
    department,
    joiningDate,
    salary,
    salaryCurrency,
    salaryFrequency,
    bankAccount,
    taxId,
    isSalaryFrozen,
    supervisor,
    permissions: Array.from(BASE_EMPLOYEE_PERMISSIONS),
    systemAccessLevel,
    isSupervisor,
    skills,
    performanceRating,
    lastPromotionDate,
    workShift,
    leaveBalance,
    createdBy: admin.id,
    updatedBy: admin.id
  });

  if (!user.roles.includes(UserRole.EMPLOYEE)) {
    user.roles = Array.from(new Set([UserRole.EMPLOYEE, ...user.roles]));
    await user.save();
  }

  // 8. Response
  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Employee profile created',
    data: profile
  });
});

/* -------------------------------------------------------------
   GET ALL EMPLOYEES
------------------------------------------------------------- */
export const getAllEmployees = asyncHandler(async (req: AuthRequest, res) => {
  const admin = req.user;

  if (!admin) {
    throw new AppError('Unauthorized: No user in request', 401);
  }

  if (admin.role !== 'admin') {
    throw new AppError('Only admin can view employee list', 403);
  }

  const { page = 1, limit = 20, department, designation } = req.query;

  const query: Record<string, unknown> = {};
  if (department) query.department = department;
  if (designation) query.designation = designation;

  const employees = await EmployeeProfile.find(query)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('userId', 'name email role');

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Employee list fetched',
    data: employees
  });
});

/* -------------------------------------------------------------
   GET SINGLE EMPLOYEE BY ID
------------------------------------------------------------- */
export const getEmployeeById = asyncHandler(async (req: AuthRequest, res) => {
  const admin = req.user;

  if (!admin) {
    throw new AppError('Unauthorized: No user in request', 401);
  }

  if (admin.role !== 'admin') {
    throw new AppError('Only admin can view employee details', 403);
  }

  const { id } = req.params;

  const employee = await EmployeeProfile.findById(id).populate('userId', 'name email role');

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Employee details fetched',
    data: employee
  });
});

/* -------------------------------------------------------------
   PERMISSIONS
------------------------------------------------------------- */
const ensureAdmin = (admin: AuthRequest['user']) => {
  if (!admin) {
    throw new AppError('Unauthorized: No user in request', 401);
  }

  if (admin.role !== 'admin') {
    throw new AppError('Only admin can manage employee permissions', 403);
  }
};

const assertValidPermissions = (permissions: string[]) => {
  const invalid = permissions.filter((permission) => !isValidEmployeePermission(permission));
  if (invalid.length) {
    throw new AppError(`Invalid permissions: ${invalid.join(', ')}`, 400);
  }
};

export const listEmployeePermissions = asyncHandler(async (req: AuthRequest, res) => {
  ensureAdmin(req.user);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Employee permissions fetched',
    data: {
      basePermissions: Array.from(BASE_EMPLOYEE_PERMISSIONS),
      availablePermissions: Array.from(ALL_EMPLOYEE_PERMISSIONS)
    }
  });
});

export const addEmployeePermissions = asyncHandler(async (req: AuthRequest, res) => {
  ensureAdmin(req.user);

  const { id } = req.params;
  const { permissions } = req.body as { permissions: string[] };

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    throw new AppError('permissions array is required', 400);
  }

  assertValidPermissions(permissions);

  const employee = await EmployeeProfile.findById(id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const merged = normalizePermissions([
    ...Array.from(BASE_EMPLOYEE_PERMISSIONS),
    ...(employee.permissions || []),
    ...permissions
  ]);

  employee.permissions = merged;
  await employee.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Employee permissions updated',
    data: { permissions: employee.permissions }
  });
});

export const removeEmployeePermissions = asyncHandler(async (req: AuthRequest, res) => {
  ensureAdmin(req.user);

  const { id } = req.params;
  const { permissions } = req.body as { permissions: string[] };

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    throw new AppError('permissions array is required', 400);
  }

  assertValidPermissions(permissions);

  const baseSet = new Set<string>(BASE_EMPLOYEE_PERMISSIONS);
  const removingBase = permissions.filter((permission) => baseSet.has(permission));
  if (removingBase.length) {
    throw new AppError(`Base permissions cannot be removed: ${removingBase.join(', ')}`, 400);
  }

  const employee = await EmployeeProfile.findById(id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const nextPermissions = (employee.permissions || []).filter(
    (permission) => !permissions.includes(permission)
  );

  employee.permissions = normalizePermissions([
    ...Array.from(BASE_EMPLOYEE_PERMISSIONS),
    ...nextPermissions
  ]);
  await employee.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Employee permissions updated',
    data: { permissions: employee.permissions }
  });
});
