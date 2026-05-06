const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
} = require('../controllers/restaurantController');
const { authMiddleware, restaurantMiddleware } = require('../middleware/auth');

// GET /api/restaurants - Get all restaurants
router.get('/', getAllRestaurants);

// GET /api/restaurants/:id - Get restaurant by ID
router.get('/:id', getRestaurantById);

// GET /api/restaurants/:id/menu - Get restaurant menu
router.get('/:id/menu', getRestaurantMenu);

// POST /api/restaurants - Create restaurant (restaurant only)
router.post('/', authMiddleware, restaurantMiddleware, createRestaurant);

module.exports = router;
