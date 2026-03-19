import { Request, Response } from 'express';

import {
  buildActiveShiftFilter,
  buildShiftListFilter,
  calculateExpectedCash,
  parseNonNegativeNumber,
  roundMoney,
  toObjectId,
  toOptionalTrimmedString,
  validateObjectId
} from '../helper/shift.helper';
import { Branch } from '../models/branchModel';
import { Drawer } from '../models/drawerModel';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Shift, ShiftStatus } from '../models/shiftModel';
// Open a new shift
export const openShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const branchName = toOptionalTrimmedString(req.body.branchName);
  if (!branchName) throw new AppError('branchName is required', 400);

  const drawerId = String(req.body.drawerId ?? '');
  validateObjectId(drawerId, 'drawerId must be a valid id');

  const openingCash = parseNonNegativeNumber(req.body.openingCash, 'openingCash');
  const notes = toOptionalTrimmedString(req.body.notes);

  const branch = await Branch.findOne({ branchName }).lean();
  if (!branch) {
    throw new AppError('Branch not found', 404);
  }

  const drawerRecord = await Drawer.findById(drawerId).lean();
  if (!drawerRecord) {
    throw new AppError('Drawer not found', 404);
  }

  if (String(drawerRecord.branchId) !== String(branch._id)) {
    throw new AppError('Drawer does not belong to the provided branch', 400);
  }

  const drawer = {
    drawerName: drawerRecord.drawerName,
    branchId: toObjectId(String(drawerRecord.branchId), 'drawer.branchId')
  };

  const existingDrawerShift = await Shift.findOne({
    'drawer.branchId': drawer.branchId,
    'drawer.drawerName': drawer.drawerName,
    status: ShiftStatus.OPEN
  });

  console.log('👌 Existing drawer shift:', existingDrawerShift);

  if (existingDrawerShift) {
    throw new AppError('Shift already open for this drawer', 409);
  }

  const existingUserShift = await Shift.findOne({
    openedBy: userId,
    status: ShiftStatus.OPEN
  });

  if (existingUserShift) {
    throw new AppError('User already has an open shift', 409);
  }

  const expectedCash = openingCash;

  const shift = await Shift.create({
    branch: {
      branchName: branch.branchName,
      branchLocation: branch.branchLocation,
      branchManagerId: branch.branchManagerId
    },
    drawer,
    openingCash,
    openedBy: toObjectId(String(userId), 'openedBy'),
    expectedCash,
    notes
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Shift opened successfully',
    data: shift
  });
});
// Close shift controller
export const closeShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  validateObjectId(id, 'Invalid shift id');

  const closingCash = parseNonNegativeNumber(req.body.closingCash, 'closingCash');
  const cashSalesTotal =
    req.body.cashSalesTotal === undefined
      ? undefined
      : parseNonNegativeNumber(req.body.cashSalesTotal, 'cashSalesTotal');
  const notes = toOptionalTrimmedString(req.body.notes);

  const shift = await Shift.findById(id);
  if (!shift) throw new AppError('Shift not found', 404);

  if (shift.status === ShiftStatus.CLOSED) {
    throw new AppError('Shift already closed', 409);
  }

  const effectiveCashSales = cashSalesTotal === undefined ? shift.cashSalesTotal : cashSalesTotal;

  const expectedCash = calculateExpectedCash({
    openingCash: shift.openingCash,
    cashSalesTotal: effectiveCashSales,
    cashInTotal: shift.cashInTotal,
    cashOutTotal: shift.cashOutTotal
  });

  const overShort = roundMoney(closingCash - expectedCash);

  shift.closingCash = closingCash;
  shift.cashSalesTotal = effectiveCashSales;
  shift.expectedCash = expectedCash;
  shift.overShort = overShort;
  shift.status = ShiftStatus.CLOSED;
  shift.closedAt = new Date();
  shift.closedBy = toObjectId(String(userId), 'closedBy');
  if (notes !== undefined) {
    shift.notes = notes;
  }

  await shift.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Shift closed successfully',
    data: shift
  });
});

export const getActiveShift = asyncHandler(async (req: Request, res: Response) => {
  const { branchId, drawerName, openedBy } = req.query as Record<string, string>;
  const filter = buildActiveShiftFilter({ branchId, drawerName, openedBy });

  const shift = await Shift.findOne(filter).lean();
  if (!shift) throw new AppError('Active shift not found', 404);

  const expectedCash = calculateExpectedCash({
    openingCash: shift.openingCash,
    cashSalesTotal: shift.cashSalesTotal,
    cashInTotal: shift.cashInTotal,
    cashOutTotal: shift.cashOutTotal
  });

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Active shift fetched successfully',
    data: {
      ...shift,
      expectedCash
    }
  });
});

export const getShiftById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateObjectId(id, 'Invalid shift id');

  const shift = await Shift.findById(id).lean();
  if (!shift) throw new AppError('Shift not found', 404);

  const expectedCash = calculateExpectedCash({
    openingCash: shift.openingCash,
    cashSalesTotal: shift.cashSalesTotal,
    cashInTotal: shift.cashInTotal,
    cashOutTotal: shift.cashOutTotal
  });

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Shift fetched successfully',
    data: {
      ...shift,
      expectedCash
    }
  });
});

export const listShifts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const { branchId, drawerName, status } = req.query as Record<string, string>;
  const filter = buildShiftListFilter({ branchId, drawerName, status });

  const [items, total] = await Promise.all([
    Shift.find(filter).sort({ openedAt: -1 }).skip(skip).limit(limit).lean(),
    Shift.countDocuments(filter)
  ]);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Shifts fetched successfully',
    data: {
      shifts: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});
