const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
} = require('../controllers/menuController');
const { authMiddleware, restaurantMiddleware } = require('../middleware/auth');

// GET /api/menu/:restaurantId - Get menu items for restaurant
router.get('/:restaurantId', getMenuItems);

// POST /api/menu - Create menu item (restaurant only)
router.post('/', authMiddleware, restaurantMiddleware, createMenuItem);

// PUT /api/menu/:id - Update menu item (restaurant only)
router.put('/:id', authMiddleware, restaurantMiddleware, updateMenuItem);

module.exports = router;
