import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error-handler';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authorization token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token); // { id, email, role }

    // Attach to request
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      employeeType: payload.employeeType,
      customerType: payload.customerType
    };

    next();
  } catch (err) {
    throw new AppError('Invalid or expired access token', 401);
  }
};
