import { responseHandler } from '../utils/response-handler';
import { asyncHandler } from '../utils/async-handler';
import { UserRole } from '../models/userModel';
import { Customer, ICustomer } from '../models/customerModel';
import { AppError } from '../utils/error-handler';
import mongoose from 'mongoose';
import { Response } from 'express-serve-static-core';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { setRefreshTokenCookie } from '../utils/cookies';
import bcrypt from 'bcryptjs';
import { Employee, EmployeeType } from '../models/employeeModel';

export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, address, customerType } = req.body;

  if (!fullName || !email || !password || !phone || !address || !customerType) {
    throw new AppError('Missing required fields', 400);
  }
  if (!address.street || !address.city || !address.country) {
    throw new AppError('Address must include street, city, and country', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const session = await mongoose.startSession();
  let customer;

  try {
    await session.withTransaction(async () => {
      const [created] = await Customer.create(
        [
          {
            fullName,
            email,
            password: passwordHash,
            phone,
            role: UserRole.CUSTOMER,
            address,
            customerType
          }
        ],
        { session }
      );

      customer = created;

      const payload = {
        id: created._id.toString(),
        email: created.email,
        role: created.role
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      setRefreshTokenCookie(res, refreshToken);

      responseHandler(res, {
        statusCode: 201,
        success: true,
        message: 'Customer registered successfully',
        data: {
          accessToken,
          user: {
            id: created._id,
            fullName: created.fullName,
            email: created.email,
            role: created.role
          },
          profile: created
        }
      });
    });
  } finally {
    session.endSession();
  }
});

export const registerEmployee = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, employeeType, department, supervisor, salary } =
    req.body;

  if (!fullName || !email || !password || !phone || !employeeType) {
    throw new AppError('Missing required fields', 400);
  }

  if (!Object.values(EmployeeType).includes(employeeType)) {
    throw new AppError(
      `Invalid employeeType. Allowed: ${Object.values(EmployeeType).join(', ')}`,
      400
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const session = await mongoose.startSession();
  let employee;

  try {
    await session.withTransaction(async () => {
      const [created] = await Employee.create(
        [
          {
            fullName,
            email,
            password: passwordHash,
            phone,
            role: UserRole.EMPLOYEE,
            employeeType,
            department,
            supervisor,
            salary
          }
        ],
        { session }
      );

      employee = created;

      const payload = {
        id: created._id.toString(),
        email: created.email,
        role: created.role
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      setRefreshTokenCookie(res, refreshToken);

      responseHandler(res, {
        statusCode: 201,
        success: true,
        message: 'Employee registered successfully',
        data: {
          accessToken,
          user: {
            id: created._id,
            fullName: created.fullName,
            email: created.email,
            role: created.role
          },
          profile: created
        }
      });
    });
  } finally {
    session.endSession();
  }
});
