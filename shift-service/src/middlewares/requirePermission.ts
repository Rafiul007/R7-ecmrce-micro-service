import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error-handler';
import { canPerformAction } from '../helper/canPerformAction';

export function requirePermission(action: Parameters<typeof canPerformAction>[1]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const userRole = req.user.role;

    const allowed = canPerformAction(userRole, action);

    if (!allowed) {
      throw new AppError('Forbidden: You do not have permission', 403);
    }

    next();
  };
}
