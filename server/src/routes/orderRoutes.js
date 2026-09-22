import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';
import { validateRequest, orderSchemaValidation } from '../middlewares/validator.js';

const router = express.Router();

// All order endpoints require a valid JWT
router.use(verifyToken);

router.post('/', validateRequest(orderSchemaValidation), createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin Management
router.get('/', requireRole('admin'), getAllOrders);
router.patch('/:id/status', requireRole('admin'), updateOrderStatus);

export default router;