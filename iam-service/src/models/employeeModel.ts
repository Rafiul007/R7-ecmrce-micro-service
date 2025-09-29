import { Schema, Types } from 'mongoose';
import { IUser, User, UserRole } from './userModel';

export enum EmployeeType {
  MANAGER = 'manager',
  STAFF = 'staff',
  DELIVERY = 'delivery',
  SUPPORT = 'support'
}

export interface IEmployee extends IUser {
  employeeType: EmployeeType;
  department?: string;
  supervisor?: Types.ObjectId;
  salary?: number;
}

const EmployeeSchema = new Schema<IEmployee>({
  employeeType: {
    type: String,
    enum: Object.values(EmployeeType),
    required: true
  },
  department: { type: String, trim: true },
  supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
  salary: { type: Number, min: 0 }
});

export const Employee = User.discriminator<IEmployee>(UserRole.EMPLOYEE, EmployeeSchema);
