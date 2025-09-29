import { Router } from 'express';
import { registerCustomer, registerEmployee } from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerCustomerValidation } from '../validation/auth.validations';
import { body } from 'express-validator';
import { CustomerType } from '../models/customerModel';
import { EmployeeType } from '../models/employeeModel';

const router = Router();

/**
 * @route   POST /api/customers/register
 * @desc    Register a new customer
 * @access  Public
 */
router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),

    body('address').notEmpty().withMessage('Address is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.country').notEmpty().withMessage('Country is required'),

    body('customerType')
      .isIn(Object.values(CustomerType))
      .withMessage(`Customer type must be one of: ${Object.values(CustomerType).join(', ')}`)
  ],
  validateRequest,
  registerCustomer
);

router.post(
  '/register/employee',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),

    body('employeeType')
      .isIn(Object.values(EmployeeType))
      .withMessage(`Employee type must be one of: ${Object.values(EmployeeType).join(', ')}`),

    body('department').optional().isString().withMessage('Department must be a string'),
    body('supervisor').optional().isMongoId().withMessage('Supervisor must be a valid User ID'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number')
  ],
  validateRequest,
  registerEmployee
);
export default router;
