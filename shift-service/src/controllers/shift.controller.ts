import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Shift, ShiftStatus } from '../models/shiftModel';

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const calculateExpectedCash = (shift: {
  openingCash: number;
  cashSalesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
}) => {
  return roundMoney(
    shift.openingCash + shift.cashSalesTotal + shift.cashInTotal - shift.cashOutTotal
  );
};

export const openShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const employeeId = req.user?.employeeId;
  if (!userId) throw new AppError('Unauthorized', 401);
  if (!employeeId) throw new AppError('Employee profile required to open shift', 403);

  const { branchId, branchName, openingCash, openedByName, notes } = req.body;

  const existingBranchShift = await Shift.findOne({
    branchId,
    status: ShiftStatus.OPEN
  });

  if (existingBranchShift) {
    throw new AppError('Shift already open for this branch', 409);
  }

  const existingUserShift = await Shift.findOne({
    openedBy: userId,
    status: ShiftStatus.OPEN
  });

  if (existingUserShift) {
    throw new AppError('User already has an open shift', 409);
  }

  const expectedCash = roundMoney(Number(openingCash));

  const shift = await Shift.create({
    branchId,
    branchName,
    employeeId,
    openingCash: Number(openingCash),
    openedBy: new mongoose.Types.ObjectId(userId),
    openedByName,
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

export const closeShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid shift id', 400);

  const { closingCash, cashSalesTotal, closedByName, notes } = req.body;

  const shift = await Shift.findById(id);
  if (!shift) throw new AppError('Shift not found', 404);

  if (shift.status === ShiftStatus.CLOSED) {
    throw new AppError('Shift already closed', 409);
  }

  const effectiveCashSales =
    typeof cashSalesTotal === 'number' ? cashSalesTotal : shift.cashSalesTotal;

  const expectedCash = calculateExpectedCash({
    openingCash: shift.openingCash,
    cashSalesTotal: effectiveCashSales,
    cashInTotal: shift.cashInTotal,
    cashOutTotal: shift.cashOutTotal
  });

  const overShort = roundMoney(Number(closingCash) - expectedCash);

  shift.closingCash = Number(closingCash);
  shift.cashSalesTotal = effectiveCashSales;
  shift.expectedCash = expectedCash;
  shift.overShort = overShort;
  shift.status = ShiftStatus.CLOSED;
  shift.closedAt = new Date();
  shift.closedBy = new mongoose.Types.ObjectId(userId);
  shift.closedByName = closedByName || shift.closedByName;
  shift.notes = notes || shift.notes;

  await shift.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Shift closed successfully',
    data: shift
  });
});

export const getActiveShift = asyncHandler(async (req: Request, res: Response) => {
  const { branchId, openedBy } = req.query as Record<string, string>;

  if (!branchId && !openedBy) {
    throw new AppError('branchId or openedBy query param is required', 400);
  }

  const filter: Record<string, unknown> = { status: ShiftStatus.OPEN };
  if (branchId) filter.branchId = branchId;
  if (openedBy) filter.openedBy = openedBy;

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
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid shift id', 400);

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

  const { branchId, status } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};

  if (branchId) filter.branchId = branchId;
  if (status) filter.status = status;

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
