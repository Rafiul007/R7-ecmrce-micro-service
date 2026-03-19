import { body, param, query } from 'express-validator';

export const createDrawerValidation = [
  body('drawerName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('drawerName is required'),
  body('branchId').isMongoId().withMessage('branchId must be a valid id')
];

export const listDrawersValidation = [
  param('branchId').isMongoId().withMessage('Invalid branch id'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const getDrawerByIdValidation = [
  param('id').isMongoId().withMessage('Invalid drawer id')
];
