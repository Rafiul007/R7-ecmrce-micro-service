import mongoose, { Schema, Document, Types } from 'mongoose';

export enum EmployeeType {
  MANAGER = 'manager',
  STAFF = 'staff',
  DELIVERY = 'delivery',
  SUPPORT = 'support'
}

export enum EmploymentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  RESIGNED = 'resigned'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern'
}

export interface IEmployeeProfile extends Document {
  userId: Types.ObjectId;
  employeeType: EmployeeType;

  // Personal
  phone: string;
  secondaryPhone?: string;
  gender: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };

  // Employment details
  employeeCode: string;
  employmentType: EmploymentType;
  designation: string;
  department: string;
  joiningDate: Date;
  endDate?: Date;
  status: EmploymentStatus;

  // Payroll
  salary: number;
  salaryCurrency: string;
  salaryFrequency: 'hourly' | 'weekly' | 'monthly';
  bankAccount?: string;
  taxId?: string;
  isSalaryFrozen?: boolean;

  // Access
  permissions?: string[];
  systemAccessLevel?: 'low' | 'medium' | 'high';
  supervisor?: Types.ObjectId;
  isSupervisor?: boolean;

  // Performance
  skills?: string[];
  performanceRating?: number;
  lastPromotionDate?: Date;

  // Attendance
  workShift?: 'morning' | 'evening' | 'night' | 'rotating';
  leaveBalance?: number;

  // Audit
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const EmployeeProfileSchema = new Schema<IEmployeeProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    employeeType: {
      type: String,
      enum: Object.values(EmployeeType),
      required: true
    },

    phone: { type: String, required: true },
    secondaryPhone: String,
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dateOfBirth: { type: Date, required: true },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },

    emergencyContact: {
      type: {
        name: String,
        phone: String,
        relation: String
      },
      required: true
    },

    employeeCode: { type: String, unique: true, required: true },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
      default: EmploymentType.FULL_TIME
    },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    endDate: Date,
    status: {
      type: String,
      enum: Object.values(EmploymentStatus),
      default: EmploymentStatus.ACTIVE
    },

    salary: { type: Number, min: 0, required: true },
    salaryCurrency: { type: String, required: true, default: 'BDT' },
    salaryFrequency: {
      type: String,
      enum: ['hourly', 'weekly', 'monthly'],
      required: true,
      default: 'monthly'
    },
    bankAccount: String,
    taxId: String,
    isSalaryFrozen: { type: Boolean, default: false },

    permissions: [String],
    systemAccessLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
    isSupervisor: Boolean,

    skills: [String],
    performanceRating: Number,
    lastPromotionDate: Date,

    workShift: {
      type: String,
      enum: ['morning', 'evening', 'night', 'rotating'],
      default: 'morning'
    },
    leaveBalance: { type: Number, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const EmployeeProfile = mongoose.model<IEmployeeProfile>(
  'EmployeeProfile',
  EmployeeProfileSchema
);
