import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
        _id: string;
        email: string;
      };
    }
  }
}
