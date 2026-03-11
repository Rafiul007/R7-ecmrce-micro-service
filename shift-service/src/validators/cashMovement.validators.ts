import { body, query } from 'express-validator';

export const createCashMovementValidation = [
  body('shiftId').isMongoId().withMessage('Valid shiftId is required'),
  body('type').isIn(['in', 'out']).withMessage('type must be in or out'),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount must be greater than 0'),
  body('reason').optional().isString().trim().isLength({ max: 500 }),
  body('createdByName').optional().isString().trim()
];

export const listCashMovementsValidation = [
  query('shiftId').isMongoId().withMessage('Valid shiftId is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];
