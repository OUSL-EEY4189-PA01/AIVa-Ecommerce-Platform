import express from 'express';
import { createOrder, getMyOrders, getOrderById, getOrders, updateOrderToPaid, updateOrderToDelivered } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);


router.get('/', protect, admin, getOrders);
router.put('/:id/pay', protect, admin, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);


router.get('/:id', protect, getOrderById);

export default router;
