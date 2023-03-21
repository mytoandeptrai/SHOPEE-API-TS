import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import { Role } from 'utils/constants/role';
import * as controller from './controller';

const router = Router();

router
  .route('/')
  .get(authMiddleware.protectRouteMiddleware, authMiddleware.authorizeMiddleware(Role.ADMIN), controller.getAllOrders);
router
  .route('/:id')
  .put(
    authMiddleware.protectRouteMiddleware,
    authMiddleware.authorizeMiddleware(Role.ADMIN),
    controller.updateStatusOfOrder
  );

export default router;
