import { Router } from 'express';
import { asyncRouteHandler } from 'middlewares';
import authMiddleware from 'middlewares/authMiddleware';
import { Role } from 'utils/constants/role';
import * as controller from './controller';

const router = Router();

router.post(
  '/create',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.ADMIN),
  asyncRouteHandler(controller.createNewProduct)
);

router
  .route('/:id')
  .delete(
    authMiddleware.protectRouteMiddleware,
    authMiddleware.authorizeMiddleware(Role.ADMIN),
    asyncRouteHandler(controller.deleteProduct)
  )
  .patch(
    authMiddleware.protectRouteMiddleware,
    authMiddleware.authorizeMiddleware(Role.ADMIN),
    asyncRouteHandler(controller.updateProduct)
  );

export default router;
