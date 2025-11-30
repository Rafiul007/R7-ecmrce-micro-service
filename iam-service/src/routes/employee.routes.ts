import express from 'express';
import { body } from 'express-validator';
import { createEmployeeProfile } from '../controllers/employee.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { requireAuth } from '../middlewares/requireAuth';
import { EmployeeType, EmploymentType } from '../models/employeeModel';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = express.Router();

/**
 * @api {post} /api/employee/create
 * @description Admin creates an employee profile for an existing user.
 * @access ADMIN ONLY (Bearer token required)
 *
 * @body
 *   userId: ObjectId (required)
 *   employeeType: manager | staff | delivery | support (required)
 *   phone: string (required)
 *   gender: male | female | other (required)
 *   dateOfBirth: YYYY-MM-DD (required)
 *   emergencyContact: { name, phone, relation } (required)
 *   employmentType: full_time | part_time | contract | intern (required)
 *   designation: string (required)
 *   department: string (required)
 *   joiningDate: YYYY-MM-DD (required)
 *   salary: number (required)
 *   salaryCurrency: string (required)
 *   salaryFrequency: hourly | weekly | monthly (required)
 */
router.post(
  '/register',
  requireAuth,
  requireAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('employeeType')
      .isIn(Object.values(EmployeeType))
      .withMessage(`employeeType must be: ${Object.values(EmployeeType).join(', ')}`),

    body('phone').notEmpty().withMessage('phone is required'),

    body('gender')
      .isIn(['male', 'female', 'other'])
      .withMessage('gender must be male, female, or other'),

    body('dateOfBirth').notEmpty().withMessage('dateOfBirth is required'),

    body('emergencyContact.name').notEmpty().withMessage('Emergency contact name required'),
    body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone required'),
    body('emergencyContact.relation').notEmpty().withMessage('Emergency contact relation required'),

    body('employmentType')
      .isIn(Object.values(EmploymentType))
      .withMessage(`employmentType must be: ${Object.values(EmploymentType).join(', ')}`),

    body('designation').notEmpty().withMessage('designation is required'),
    body('department').notEmpty().withMessage('department is required'),
    body('joiningDate').notEmpty().withMessage('joiningDate is required'),

    body('salary').notEmpty().withMessage('salary is required'),
    body('salaryCurrency').notEmpty().withMessage('salaryCurrency is required'),

    body('salaryFrequency')
      .isIn(['hourly', 'weekly', 'monthly'])
      .withMessage('salaryFrequency must be hourly | weekly | monthly')
  ],
  validateRequest,
  createEmployeeProfile
);

export default router;
