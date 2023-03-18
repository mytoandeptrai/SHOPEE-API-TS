import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router.get('/', authMiddleware.protectRouteMiddleware, controller.getAllCarts);
router.post('/create', authMiddleware.protectRouteMiddleware, controller.addToCart);
router.delete('/delete', authMiddleware.protectRouteMiddleware, controller.deleteAllCarts);
router.delete('/:id', authMiddleware.protectRouteMiddleware, controller.deleteSingleCart);

export default router;
