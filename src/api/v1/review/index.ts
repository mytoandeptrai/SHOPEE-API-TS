import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router.post('/', authMiddleware.protectRouteMiddleware, controller.createNewReview);
router.get('/product/:id', authMiddleware.protectRouteMiddleware, controller.getAllReviewOfProduct);
router.get('/order/:id', authMiddleware.protectRouteMiddleware, controller.getAllReviewOfOrder);
router
  .route('/:id')
  .get(authMiddleware.protectRouteMiddleware, controller.getSingleReview)
  .put(authMiddleware.protectRouteMiddleware, controller.updateReview)
  .delete(authMiddleware.protectRouteMiddleware, controller.deleteReview);

export default router;
