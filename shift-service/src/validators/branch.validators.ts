import { body, param, query } from 'express-validator';

export const createBranchValidation = [
  body('branchName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('branchName is required'),
  body('branchLocation').optional().isString().trim(),
  body('branchManagerId').optional().isString().trim()
];

export const listBranchesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const getBranchByIdValidation = [
  param('id').isMongoId().withMessage('Invalid branch id')
];
