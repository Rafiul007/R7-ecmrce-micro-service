import { Request, Response } from 'express';

import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Branch } from '../models/branchModel';
import { toOptionalTrimmedString, validateObjectId } from '../helper/shift.helper';

export const createBranch = asyncHandler(async (req: Request, res: Response) => {
  const branchName = toOptionalTrimmedString(req.body.branchName);
  if (!branchName) throw new AppError('branchName is required', 400);

  const existingBranch = await Branch.findOne({ branchName });
  if (existingBranch) {
    throw new AppError('Branch already exists', 409);
  }

  const branch = await Branch.create({
    branchName,
    branchLocation: toOptionalTrimmedString(req.body.branchLocation),
    branchManagerId: toOptionalTrimmedString(req.body.branchManagerId)
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Branch created successfully',
    data: branch
  });
});

export const listBranches = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Branch.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Branch.countDocuments()
  ]);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Branches fetched successfully',
    data: {
      branches: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});

export const getBranchById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateObjectId(id, 'Invalid branch id');

  const branch = await Branch.findById(id).lean();
  if (!branch) throw new AppError('Branch not found', 404);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Branch fetched successfully',
    data: branch
  });
});
