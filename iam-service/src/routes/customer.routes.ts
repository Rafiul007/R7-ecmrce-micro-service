import { Router } from 'express';
import { registerCustomer } from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';
import customerValidation from '../validation/customerValidation';

const router = Router();

/**
 * @route   POST /api/customers/register
 * @desc    Register a new customer
 * @access  Public
 */
router.post('/register', customerValidation, validateRequest, registerCustomer);

export default router;
