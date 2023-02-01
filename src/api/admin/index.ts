import { Router } from 'express';
import importRouter from './import';
import productsRouter from './products';
import bannersRouter from './banners';
const router = Router();

router.use('/import', importRouter);
router.use('/products', productsRouter);
router.use('/banners', bannersRouter);

export default router;
