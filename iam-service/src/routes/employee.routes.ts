import { Router } from 'express';
import { registerEmployee } from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';
import employeeValidation from '../validation/employeeValidation';

const router = Router();
router.post('/register/employee', employeeValidation, validateRequest, registerEmployee);

export default router;
