import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie
} from '../utils/cookies';
import { User, UserRole } from '../models/userModel';
import { EmployeeProfile } from '../models/employeeModel';

const pickPrimaryRole = (roles: string[]): string => {
  if (roles.includes(UserRole.ADMIN)) return UserRole.ADMIN;
  if (roles.includes(UserRole.EMPLOYEE)) return UserRole.EMPLOYEE;
  return roles[0] || UserRole.USER;
};

const buildAuthPayload = async (user: { _id: unknown; email: string; roles: string[] }) => {
  const employee = await EmployeeProfile.findOne({ userId: user._id }).select('_id employeeType');

  return {
    id: String(user._id),
    email: user.email,
    role: pickPrimaryRole(user.roles),
    employeeId: employee?._id?.toString(),
    employeeType: employee?.employeeType
  };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, roles } = req.body;

  if (!fullName || !email || !password) {
    throw new AppError('Missing required fields', 400);
  }

  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 400);

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    password: passwordHash,
    phone,
    roles: roles || ['user']
  });

  const payload = await buildAuthPayload(user);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'User registered',
    data: { accessToken }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  const payload = await buildAuthPayload(user);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in',
    data: { accessToken }
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = getRefreshTokenFromCookie(req);
  if (!token) throw new AppError('Refresh token missing', 401);

  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.id);
  if (!user) throw new AppError('User not found', 404);

  const refreshedPayload = await buildAuthPayload(user);

  const newAccess = generateAccessToken(refreshedPayload);
  const newRefresh = generateRefreshToken(refreshedPayload);

  setRefreshTokenCookie(res, newRefresh);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed',
    data: { accessToken: newAccess }
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearRefreshTokenCookie(res);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out'
  });
});

// Test
