import { Request, Response } from 'express';

import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Branch } from '../models/branchModel';
import { Drawer } from '../models/drawerModel';
import { toObjectId, toOptionalTrimmedString, validateObjectId } from '../helper/shift.helper';

export const createDrawer = asyncHandler(async (req: Request, res: Response) => {
  const drawerName = toOptionalTrimmedString(req.body.drawerName);
  if (!drawerName) throw new AppError('drawerName is required', 400);

  const branchId = String(req.body.branchId ?? '');
  validateObjectId(branchId, 'branchId must be a valid id');

  const branch = await Branch.findById(branchId).lean();
  if (!branch) throw new AppError('Branch not found', 404);

  const existingDrawer = await Drawer.findOne({
    drawerName,
    branchId: toObjectId(branchId, 'branchId')
  });
  if (existingDrawer) {
    throw new AppError('Drawer already exists for this branch', 409);
  }

  const drawer = await Drawer.create({
    drawerName,
    branchId: toObjectId(branchId, 'branchId')
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Drawer created successfully',
    data: drawer
  });
});

export const listDrawers = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const branchId = String(req.params.branchId ?? '');
  validateObjectId(branchId, 'Invalid branch id');

  const branch = await Branch.findById(branchId).lean();
  if (!branch) throw new AppError('Branch not found', 404);

  const filter = { branchId: toObjectId(branchId, 'branchId') };

  const [items, total] = await Promise.all([
    Drawer.find(filter)
      .populate('branchId', 'branchName branchLocation branchManagerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Drawer.countDocuments(filter)
  ]);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Branch drawers fetched successfully',
    data: {
      drawers: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});

export const getDrawerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateObjectId(id, 'Invalid drawer id');

  const drawer = await Drawer.findById(id)
    .populate('branchId', 'branchName branchLocation branchManagerId')
    .lean();
  if (!drawer) throw new AppError('Drawer not found', 404);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Drawer fetched successfully',
    data: drawer
  });
});
