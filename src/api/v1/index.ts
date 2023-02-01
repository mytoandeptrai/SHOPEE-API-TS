import { Router } from 'express';
import userRouter from './users';
import authRouter from './auth';
import productRouter from './products';
import bannerRouter from './banners';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);

export default router;
