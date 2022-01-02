import { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import productRoutes from '@/routes/product.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;
