import { body, param, query } from 'express-validator';

export const openShiftValidation = [
  body('branchName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('branchName is required'),
  body('drawerId').isMongoId().withMessage('drawerId must be a valid id'),
  body('openingCash').isFloat({ min: 0 }).withMessage('openingCash must be a number'),
  body('notes').optional().isString().trim().isLength({ max: 2000 })
];

export const closeShiftValidation = [
  param('id').isMongoId().withMessage('Invalid shift id'),
  body('closingCash').isFloat({ min: 0 }).withMessage('closingCash is required'),
  body('cashSalesTotal').optional().isFloat({ min: 0 }),
  body('notes').optional().isString().trim().isLength({ max: 2000 })
];

export const getActiveShiftValidation = [
  query('branchId').optional().isMongoId(),
  query('drawerName').optional().isString().trim().notEmpty(),
  query('openedBy').optional().isMongoId()
];

export const listShiftsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('branchId').optional().isMongoId(),
  query('drawerName').optional().isString().trim().notEmpty(),
  query('status').optional().isIn(['open', 'closed'])
];

export const getShiftByIdValidation = [
  param('id').isMongoId().withMessage('Invalid shift id')
];
