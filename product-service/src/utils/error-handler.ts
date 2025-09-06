import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong'
  });
};
