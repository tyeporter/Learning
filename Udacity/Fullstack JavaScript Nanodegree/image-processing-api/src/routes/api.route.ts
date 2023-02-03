import express from 'express';
import imagesRoutes from './api/images.route';

// ANCHOR: - Top-Level Constants

const router = express.Router();

// ANCHOR: - Routes

router.get('/', (req, res) => {
    res.render('api.liquid', { endpoint: '/api' });
});

// ANCHOR: - Middleware

router.use('/images', imagesRoutes);

export default router;
