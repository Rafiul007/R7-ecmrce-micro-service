import mongoose from 'mongoose';

import { ShiftStatus } from '../models/shiftModel';
import { AppError } from '../utils/error-handler';

type UnknownRecord = Record<string, unknown>;

interface ShiftCashSummary {
  openingCash: number;
  cashSalesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
}

interface ActiveShiftQueryParams {
  branchId?: string;
  drawerName?: string;
  openedBy?: string;
}

interface ShiftListQueryParams {
  branchId?: string;
  drawerName?: string;
  status?: string;
}

const isObject = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const toOptionalTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const parseNonNegativeNumber = (value: unknown, fieldName: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new AppError(`${fieldName} must be a non-negative number`, 400);
  }

  return roundMoney(parsed);
};

export const toObjectId = (value: string, fieldName: string) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`${fieldName} must be a valid id`, 400);
  }

  return new mongoose.Types.ObjectId(value);
};

export const validateObjectId = (value: string, message: string) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(message, 400);
  }
};

export const normalizeBranch = (branch: unknown) => {
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

export const normalizeDrawer = (drawer: unknown) => {
  if (!isObject(drawer)) {
    throw new AppError('drawer is required', 400);
  }

  const drawerName = toOptionalTrimmedString(drawer.drawerName);
  if (!drawerName) {
    throw new AppError('drawer.drawerName is required', 400);
  }

  const branchId = toOptionalTrimmedString(drawer.branchId);
  if (!branchId) {
    throw new AppError('drawer.branchId must be a valid id', 400);
  }

  return {
    drawerName,
    branchId: toObjectId(branchId, 'drawer.branchId')
  };
};

export const calculateExpectedCash = (shift: ShiftCashSummary) =>
  roundMoney(
    shift.openingCash + shift.cashSalesTotal + shift.cashInTotal - shift.cashOutTotal
  );

export const buildActiveShiftFilter = ({
  branchId,
  drawerName,
  openedBy
}: ActiveShiftQueryParams) => {
  if (!branchId && !openedBy && !drawerName) {
    throw new AppError('openedBy or drawer query params are required', 400);
  }

  const filter: UnknownRecord = { status: ShiftStatus.OPEN };
  const normalizedDrawerName = toOptionalTrimmedString(drawerName);

  if (branchId) {
    filter['drawer.branchId'] = toObjectId(branchId, 'branchId');
  }

  if (normalizedDrawerName) {
    if (!branchId) {
      throw new AppError('branchId is required when drawerName is provided', 400);
    }

    filter['drawer.drawerName'] = normalizedDrawerName;
  }

  if (branchId && !normalizedDrawerName && !openedBy) {
    throw new AppError(
      'drawerName is required when querying an active shift by branchId',
      400
    );
  }

  if (openedBy) {
    filter.openedBy = toObjectId(openedBy, 'openedBy');
  }

  return filter;
};

export const buildShiftListFilter = ({
  branchId,
  drawerName,
  status
}: ShiftListQueryParams) => {
  const filter: UnknownRecord = {};
  const normalizedDrawerName = toOptionalTrimmedString(drawerName);

  if (branchId) {
    filter['drawer.branchId'] = toObjectId(branchId, 'branchId');
  }

  if (normalizedDrawerName) {
    if (!branchId) {
      throw new AppError('branchId is required when drawerName is provided', 400);
    }

    filter['drawer.drawerName'] = normalizedDrawerName;
  }

  if (status) {
    if (!Object.values(ShiftStatus).includes(status as ShiftStatus)) {
      throw new AppError('Invalid status value', 400);
    }

    filter.status = status;
  }

  return filter;
};
