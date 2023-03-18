import { Router } from 'express';
import userRouter from './users';
import authRouter from './auth';
import productRouter from './products';
import bannerRouter from './banners';
import categoriesRouter from './categories';
import shopRouter from './shop';
import cartRouter from './cart';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);
router.use('/categories', categoriesRouter);
router.use('/shops', shopRouter);
router.use('/carts', cartRouter);

export default router;
