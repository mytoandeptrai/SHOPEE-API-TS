import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router
  .route('/')
  .post(authMiddleware.protectRouteMiddleware, controller.createNewOrder)
  .get(authMiddleware.protectRouteMiddleware, controller.getAllOrderOfUser);
router.route('/:id').delete(authMiddleware.protectRouteMiddleware, controller.deleteOrder);

export default router;
