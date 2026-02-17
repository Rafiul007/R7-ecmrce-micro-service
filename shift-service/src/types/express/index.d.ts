import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
        _id: string;
        email: string;
        employeeId?: string;
      };
    }
  }
}

export {};
