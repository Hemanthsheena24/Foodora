const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderDetails,
  getOrderStatus,
  getCustomerOrders,
  acceptOrder,
  updateOrderStatus,
  getRestaurantOrders,
} = require('../controllers/orderController');
const { authMiddleware, customerMiddleware, restaurantMiddleware } = require('../middleware/auth');

// POST /api/orders - Create order (customer only)
router.post('/', authMiddleware, customerMiddleware, createOrder);

// GET /api/orders/:id - Get order details
router.get('/:id', authMiddleware, getOrderDetails);

// GET /api/orders/:id/status - Get order status
router.get('/:id/status', getOrderStatus);

// GET /api/orders/customer/my-orders - Get customer orders
router.get('/customer/my-orders', authMiddleware, customerMiddleware, getCustomerOrders);

// POST /api/orders/:id/accept - Accept order (restaurant only)
router.post('/:id/accept', authMiddleware, restaurantMiddleware, acceptOrder);

// POST /api/orders/:id/update-status - Update order status (restaurant only)
router.post('/:id/update-status', authMiddleware, restaurantMiddleware, updateOrderStatus);

// GET /api/orders/restaurant/my-orders - Get restaurant orders
router.get('/restaurant/my-orders', authMiddleware, restaurantMiddleware, getRestaurantOrders);

module.exports = router;
