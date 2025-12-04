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
import { User } from '../models/userModel';

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

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.roles[0]
  };

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

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.roles[0]
  };

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

  const newAccess = generateAccessToken(payload);
  const newRefresh = generateRefreshToken(payload);

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
