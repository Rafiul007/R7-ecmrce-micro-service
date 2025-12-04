import { NextFunction, Response } from 'express';
import { AppError } from '../utils/error-handler';
import { UserRole } from '../models/userModel';
import { AuthRequest } from '../types/auth-request';

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Unauthorized: No user found on request', 401);
  }

  console.log('😎 User role:', req.user.role);

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError('Only admin can perform this action', 403);
  }

  next();
};
