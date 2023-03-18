import { Router } from 'express';
import authRouter from './auth';
import bannerRouter from './banners';
import cartRouter from './cart';
import categoriesRouter from './categories';
import productRouter from './products';
import reviewRouter from './review';
import shopRouter from './shop';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);
router.use('/categories', categoriesRouter);
router.use('/shops', shopRouter);
router.use('/carts', cartRouter);
router.use('/reviews', reviewRouter);

export default router;
