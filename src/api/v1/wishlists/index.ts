import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router.get('/', controller.getUserWishLists);
router.post('/create', authMiddleware.protectRouteMiddleware, controller.addToWishList);
router.delete('/delete', authMiddleware.protectRouteMiddleware, controller.removeFromWishList);

export default router;
