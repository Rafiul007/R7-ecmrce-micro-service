import { CustomerProfile } from '../models/customerModel';
import { User } from '../models/userModel';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Request, Response, NextFunction } from 'express';

export const createCustomerProfile = asyncHandler(async (req: Request, res: Response) => {
  const { email, address, customerType, gender, dateOfBirth } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);

  const userId = user._id;

  if (!address || !address.street || !address.city || !address.country) {
    throw new AppError('Incomplete address fields', 400);
  }

  const exists = await CustomerProfile.findOne({ userId });
  if (exists) throw new AppError('Customer profile already exists', 400);

  const profile = await CustomerProfile.create({
    userId,
    address,
    customerType,
    gender,
    dateOfBirth,
    createdBy: userId
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Customer profile created',
    data: profile
  });
});
