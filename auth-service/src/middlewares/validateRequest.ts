import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/error-handler';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    throw new AppError(`Validation failed: ${extractedErrors}`, 422);
  }
  next();
};
