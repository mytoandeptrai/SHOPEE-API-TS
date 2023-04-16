import { Router } from 'express';
import importRouter from './import';
import productsRouter from './products';
import bannersRouter from './banners';
import vouchersRouter from './vouchers';
const router = Router();

router.use('/import', importRouter);
router.use('/products', productsRouter);
router.use('/banners', bannersRouter);
router.use('/vouchers', vouchersRouter);

export default router;
