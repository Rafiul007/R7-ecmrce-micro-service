import { EmployeeProfile, EmployeeType } from '../models/employeeModel';
import { User } from '../models/userModel';
import { AuthRequest } from '../types/auth-request';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';

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
    permissions,
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
    permissions,
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

  // 8. Response
  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Employee profile created',
    data: profile
  });
});
