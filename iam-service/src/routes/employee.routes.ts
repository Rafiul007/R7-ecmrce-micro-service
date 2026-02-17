import express from 'express';
import { body } from 'express-validator';
import {
  createEmployeeProfile,
  getAllEmployees,
  getEmployeeById,
  listEmployeePermissions,
  addEmployeePermissions,
  removeEmployeePermissions
} from '../controllers/employee.controller';

import { validateRequest } from '../middlewares/validateRequest';
import { requireAuth } from '../middlewares/requireAuth';
import { EmployeeType, EmploymentType } from '../models/employeeModel';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = express.Router();

/**
 * @api {post} /api/staff/register
 * @description Admin creates an employee profile for an existing user.
 * @access ADMIN ONLY
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

/**
 * @api {get} /api/staff
 * @description Get all employees with optional pagination + filters.
 * @access ADMIN ONLY
 */
router.get('/', requireAuth, requireAdmin, getAllEmployees);

/**
 * @api {get} /api/staff/permissions
 * @description Get available employee permissions + base permissions.
 * @access ADMIN ONLY
 */
router.get('/permissions', requireAuth, requireAdmin, listEmployeePermissions);

/**
 * @api {patch} /api/staff/:id/permissions/add
 * @description Add permissions to an employee profile.
 * @access ADMIN ONLY
 */
router.patch(
  '/:id/permissions/add',
  requireAuth,
  requireAdmin,
  [body('permissions').isArray({ min: 1 }).withMessage('permissions array is required')],
  validateRequest,
  addEmployeePermissions
);

/**
 * @api {patch} /api/staff/:id/permissions/remove
 * @description Remove permissions from an employee profile (base permissions cannot be removed).
 * @access ADMIN ONLY
 */
router.patch(
  '/:id/permissions/remove',
  requireAuth,
  requireAdmin,
  [body('permissions').isArray({ min: 1 }).withMessage('permissions array is required')],
  validateRequest,
  removeEmployeePermissions
);

/**
 * @api {get} /api/staff/:id
 * @description Get details of a single employee by MongoDB ID.
 * @access ADMIN ONLY
 */
router.get('/:id', requireAuth, requireAdmin, getEmployeeById);

export default router;
