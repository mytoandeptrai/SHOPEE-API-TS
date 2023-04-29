import { Router } from 'express';
import authMiddleware from 'middlewares/authMiddleware';
import * as controller from './controller';

const router = Router();

router.get('/', authMiddleware.protectRouteMiddleware, controller.getAllVouchers);
router.get('/discover', controller.getAllPublicVouchers);
router.get('/my-voucher', authMiddleware.protectRouteMiddleware, controller.getVoucherOfUser);
router.get('/:voucherId', authMiddleware.protectRouteMiddleware, controller.getSingleVoucher);
router.post('/save', authMiddleware.protectRouteMiddleware, controller.saveVoucher);

export default router;
