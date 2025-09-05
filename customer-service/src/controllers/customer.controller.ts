import { NextFunction, Request, Response } from 'express';
import { Customer } from '../models/customerModel';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';

// Get customer service status
export const getCustomerServiceStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    responseHandler(res, {
      statusCode: 200,
      success: true,
      message: 'Customer service is running',
      data: {}
    });
  }
);

// Create customer profile
export const createCustomerProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const existingCustomer = await Customer.findOne({ userId });
  if (existingCustomer) {
    throw new AppError('Customer profile already exists for this user', 400);
  }

  const { fullName, phone, address } = req.body;

  const customer = await Customer.create({
    userId,
    fullName,
    phone,
    address
  });

  responseHandler(res, {
    success: true,
    statusCode: 201,
    message: 'Customer profile created successfully',
    data: customer
  });
});

// Get current authenticated customer profile
export const getMyCustomerProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const customer = await Customer.findOne({ userId });
  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  responseHandler(res, {
    success: true,
    statusCode: 200,
    message: 'Customer profile fetched',
    data: customer
  });
});

// TODO: Update customer profile
// TODO: Delete customer profile
// TODO: Admin - Get all customer profiles
