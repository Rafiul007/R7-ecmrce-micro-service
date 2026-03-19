import { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  calculateExpectedCash,
  roundMoney,
  toObjectId,
  validateObjectId
} from '../helper/shift.helper';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { CashMovement, CashMovementType } from '../models/cashMovementModel';
import { Shift, ShiftStatus } from '../models/shiftModel';

export const createCashMovement = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { shiftId, type, amount, reason, createdByName } = req.body;

  validateObjectId(shiftId, 'Invalid shift id');

  const shift = await Shift.findById(shiftId);
  if (!shift) throw new AppError('Shift not found', 404);

  if (shift.status !== ShiftStatus.OPEN) {
    throw new AppError('Cannot add cash movement to a closed shift', 409);
  }

  const movement = await CashMovement.create({
    shift: shift._id,
    type,
    amount,
    reason,
    createdBy: toObjectId(String(userId), 'createdBy'),
    createdByName
  });

  if (type === CashMovementType.IN) {
    shift.cashInTotal = roundMoney(shift.cashInTotal + Number(amount));
  } else if (type === CashMovementType.OUT) {
    shift.cashOutTotal = roundMoney(shift.cashOutTotal + Number(amount));
  }

  shift.expectedCash = calculateExpectedCash({
    openingCash: shift.openingCash,
    cashSalesTotal: shift.cashSalesTotal,
    cashInTotal: shift.cashInTotal,
    cashOutTotal: shift.cashOutTotal
  });

  await shift.save();

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Cash movement recorded successfully',
    data: {
      movement,
      shiftSummary: {
        cashInTotal: shift.cashInTotal,
        cashOutTotal: shift.cashOutTotal,
        expectedCash: shift.expectedCash
      }
    }
  });
});

export const listCashMovements = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const { shiftId } = req.query as Record<string, string>;
  if (!shiftId) throw new AppError('shiftId query param is required', 400);
  if (!mongoose.isValidObjectId(shiftId)) throw new AppError('Invalid shift id', 400);

  const [items, total] = await Promise.all([
    CashMovement.find({ shift: shiftId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CashMovement.countDocuments({ shift: shiftId })
  ]);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Cash movements fetched successfully',
    data: {
      movements: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});
