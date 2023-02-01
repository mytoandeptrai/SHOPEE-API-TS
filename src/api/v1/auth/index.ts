import { Router } from 'express';
import { asyncRouteHandler, validationMiddleware } from 'middlewares';
import * as controller from './controller';
import AuthDto from './dtos';

const router = Router();

router.post('/sign-up', validationMiddleware(AuthDto.SignUpDto, 'body'), asyncRouteHandler(controller.signUp));
router.post('/sign-in', validationMiddleware(AuthDto.SignUpDto, 'body'), asyncRouteHandler(controller.signIn));
router.post(
  '/refresh-token',
  validationMiddleware(AuthDto.RefreshTokenDto, 'body'),
  asyncRouteHandler(controller.refreshToken)
);
router.post('/logout', validationMiddleware(AuthDto.RefreshTokenDto, 'body'), asyncRouteHandler(controller.logout));

export default router;
