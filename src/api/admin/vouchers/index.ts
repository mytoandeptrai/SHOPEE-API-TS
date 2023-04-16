import { Router } from 'express';
import { asyncRouteHandler } from 'middlewares';
import authMiddleware from 'middlewares/authMiddleware';
import { Role } from 'utils/constants/role';
import * as controller from './controller';

const router = Router();

router.post(
  '/',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.ADMIN),
  asyncRouteHandler(controller.createVoucher)
);

router
  .route('/:voucherId')
  .delete(
    authMiddleware.protectRouteMiddleware,
    authMiddleware.authorizeMiddleware(Role.ADMIN),
    asyncRouteHandler(controller.deleteVoucher)
  )
  .patch(
    authMiddleware.protectRouteMiddleware,
    authMiddleware.authorizeMiddleware(Role.ADMIN),
    asyncRouteHandler(controller.updateVoucher)
  );
export default router;
