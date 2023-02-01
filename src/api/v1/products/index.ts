import { Router } from 'express';
import { redisProductMiddleware } from 'middlewares';
import * as controller from './controller';

const router = Router();

router.get('/', redisProductMiddleware.checkCachedAllProducts, controller.getAllProducts);
router.get('/:id', redisProductMiddleware.checkCachedSingleProduct, controller.getSingleProduct);

export default router;
