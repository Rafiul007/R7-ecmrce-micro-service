import { Router } from 'express';
import { sampleController } from '../controllers/sample.controller';

const router = Router();
router.get('/sample', sampleController);
export default router;
