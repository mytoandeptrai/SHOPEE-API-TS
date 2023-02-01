import { Router } from 'express';
import v1Routers from './v1';
import adminRouters from './admin';

const router = Router();

router.use('/v1', v1Routers);
router.use('/admin', adminRouters);

export default router;
