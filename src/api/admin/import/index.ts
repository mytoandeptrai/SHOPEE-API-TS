import { Router } from 'express';
import { asyncRouteHandler } from 'middlewares';
import authMiddleware from 'middlewares/authMiddleware';
import { Role } from 'utils/constants/role';
import * as controller from './controller';

const router = Router();

router.post(
  '/product',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.ADMIN),
  asyncRouteHandler(controller.insertProduct)
);

router.post(
  '/category',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.ADMIN),
  asyncRouteHandler(controller.insertCategory)
);

router.post(
  '/voucher',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.ADMIN),
  asyncRouteHandler(controller.insertVoucher)
);

export default router;
