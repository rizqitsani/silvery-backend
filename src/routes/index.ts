import { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import cartRoutes from '@/routes/cart.route';
import productRoutes from '@/routes/product.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;
