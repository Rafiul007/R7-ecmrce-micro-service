import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error-handler';
import { verifyAccessToken, ITokenPayload } from '../utils/jwt';

export const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: ITokenPayload = verifyAccessToken(token);

    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    throw new AppError('Unauthorized: Invalid token', 401);
  }
};
