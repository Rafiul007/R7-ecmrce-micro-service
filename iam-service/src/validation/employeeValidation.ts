import { body } from 'express-validator';
import { EmployeeType } from '../models/employeeModel';

const employeeValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),

  body('employeeType')
    .isIn(Object.values(EmployeeType))
    .withMessage(`Employee type must be one of: ${Object.values(EmployeeType).join(', ')}`),

  body('department').optional().isString().withMessage('Department must be a string'),
  body('supervisor').optional().isMongoId().withMessage('Supervisor must be a valid User ID'),
  body('salary').optional().isNumeric().withMessage('Salary must be a number')
];

export default employeeValidation;
