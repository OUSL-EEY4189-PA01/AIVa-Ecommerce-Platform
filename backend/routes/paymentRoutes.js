import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createCheckoutSession, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify-payment', protect, verifyPayment);

export default router;