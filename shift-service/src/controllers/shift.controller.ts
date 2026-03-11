import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Shift, ShiftStatus } from '../models/shiftModel';

const roundMoney = (value: number) => Math.round(value * 100) / 100;
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toOptionalTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const parseNonNegativeNumber = (value: unknown, fieldName: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new AppError(`${fieldName} must be a non-negative number`, 400);
  }

  return roundMoney(parsed);
};

const normalizeBranch = (branch: unknown) => {
  if (!isObject(branch)) {
    throw new AppError('branch is required', 400);
  }

  const branchName = toOptionalTrimmedString(branch.branchName);
  if (!branchName) {
    throw new AppError('branch.branchName is required', 400);
  }

  return {
    branchName,
    branchLocation: toOptionalTrimmedString(branch.branchLocation),
    branchManagerId: toOptionalTrimmedString(branch.branchManagerId)
  };
};

const normalizeDrawer = (drawer: unknown) => {
  if (!isObject(drawer)) {
    throw new AppError('drawer is required', 400);
  }

  const drawerName = toOptionalTrimmedString(drawer.drawerName);
  if (!drawerName) {
    throw new AppError('drawer.drawerName is required', 400);
  }

  const branchId = toOptionalTrimmedString(drawer.branchId);
  if (!branchId || !mongoose.isValidObjectId(branchId)) {
    throw new AppError('drawer.branchId must be a valid id', 400);
  }

  return {
    drawerName,
    branchId: new mongoose.Types.ObjectId(branchId)
  };
};

const applyDrawerFilters = (
  filter: Record<string, unknown>,
  branchId?: string,
  drawerName?: string
) => {
  const normalizedDrawerName = toOptionalTrimmedString(drawerName);

  if (branchId) {
    if (!mongoose.isValidObjectId(branchId)) {
      throw new AppError('branchId must be a valid id', 400);
    }

    filter['drawer.branchId'] = new mongoose.Types.ObjectId(branchId);
  }

  if (normalizedDrawerName) {
    filter['drawer.drawerName'] = normalizedDrawerName;
  }

  return normalizedDrawerName;
};

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
// Open a new shift
export const openShift = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const branch = normalizeBranch(req.body.branch);
  const drawer = normalizeDrawer(req.body.drawer);
  const openingCash = parseNonNegativeNumber(req.body.openingCash, 'openingCash');
  const notes = toOptionalTrimmedString(req.body.notes);

  const existingDrawerShift = await Shift.findOne({
    'drawer.branchId': drawer.branchId,
    'drawer.drawerName': drawer.drawerName,
    status: ShiftStatus.OPEN
  });

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
    branch,
    drawer,
    openingCash,
    openedBy: new mongoose.Types.ObjectId(userId),
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
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid shift id', 400);

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
  shift.closedBy = new mongoose.Types.ObjectId(userId);
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

  if (!branchId && !openedBy && !drawerName) {
    throw new AppError('openedBy or drawer query params are required', 400);
  }

  const filter: Record<string, unknown> = { status: ShiftStatus.OPEN };
  const normalizedDrawerName = applyDrawerFilters(filter, branchId, drawerName);

  if (normalizedDrawerName && !branchId) {
    throw new AppError('branchId is required when drawerName is provided', 400);
  }

  if (branchId && !normalizedDrawerName && !openedBy) {
    throw new AppError(
      'drawerName is required when querying an active shift by branchId',
      400
    );
  }
  if (openedBy) {
    if (!mongoose.isValidObjectId(openedBy)) {
      throw new AppError('openedBy must be a valid id', 400);
    }
    filter.openedBy = new mongoose.Types.ObjectId(openedBy);
  }

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

  const { branchId, drawerName, status } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};

  const normalizedDrawerName = applyDrawerFilters(filter, branchId, drawerName);
  if (normalizedDrawerName && !branchId) {
    throw new AppError('branchId is required when drawerName is provided', 400);
  }

  if (status) {
    if (!Object.values(ShiftStatus).includes(status as ShiftStatus)) {
      throw new AppError('Invalid status value', 400);
    }
    filter.status = status;
  }

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
