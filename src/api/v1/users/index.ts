import { Router } from 'express';
import { asyncRouteHandler, validationMiddleware } from 'middlewares';
import authMiddleware from 'middlewares/authMiddleware';
import { Role } from 'utils/constants/role';
import * as controller from './controller';
import { CreateUserDto } from './dtos';

const router = Router();

router.route('/:id').get(authMiddleware.protectRouteMiddleware, controller.getSingleUser);
router.post('/', validationMiddleware(CreateUserDto, 'body'), asyncRouteHandler(controller.createUser));
router.put(
  '/me',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.USER, Role.SELLER, Role.ADMIN),
  asyncRouteHandler(controller.updateUser)
);
router.patch(
  '/avatar',
  authMiddleware.protectRouteMiddleware,
  authMiddleware.authorizeMiddleware(Role.USER, Role.SELLER, Role.ADMIN),
  asyncRouteHandler(controller.updateAvatar)
);

export default router;
