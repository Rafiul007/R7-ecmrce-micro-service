import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    employeeId?: string;
    employeeType?: string;
    customerType?: string;
  };
}
