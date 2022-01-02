import { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import cartRoutes from '@/routes/cart.route';
import productRoutes from '@/routes/product.route';
import statisticRoutes from '@/routes/statistic.route';
import transactionRoutes from '@/routes/transaction.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/transaction', transactionRoutes);
router.use('/statistics', statisticRoutes);

export default router;
