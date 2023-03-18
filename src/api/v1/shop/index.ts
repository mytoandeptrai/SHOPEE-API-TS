import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router.get('/', controller.getAllShops);
router.post('/create', authMiddleware.protectRouteMiddleware, controller.createNewShop);
router
  .route('/:id')
  .put(authMiddleware.protectRouteMiddleware, controller.updateCurrentShop)
  .delete(authMiddleware.protectRouteMiddleware, controller.deleteShop)
  .get(controller.getSingleShop);

export default router;
