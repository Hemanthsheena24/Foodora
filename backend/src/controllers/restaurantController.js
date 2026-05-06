const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Get all restaurants
const getAllRestaurants = async (req, res, next) => {
  try {
    console.log('📥 GET /api/restaurants called');
    const restaurants = await Restaurant.find({ isActive: true })
      .populate('owner', 'name email phone')
      .sort({ rating: -1 });

    console.log(`✅ Found ${restaurants.length} active restaurants`);
    res.json({
      success: true,
      message: 'Restaurants fetched successfully',
      data: restaurants,
      restaurants: restaurants, // For backward compatibility
    });
  } catch (error) {
    console.error('❌ Error fetching restaurants:', error);
    next(error);
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id).populate('owner', 'name email phone');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      message: 'Restaurant fetched successfully',
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant menu
const getRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get menu items
    const menuItems = await MenuItem.find({ restaurant: id, isAvailable: true }).sort({ category: 1 });

    res.json({
      message: 'Menu fetched successfully',
      menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// Create restaurant (for restaurant registration)
const createRestaurant = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, description, cuisineType, address, phone } = req.body;

    // Validate input
    if (!name || !address || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if restaurant already exists for this user
    let restaurant = await Restaurant.findOne({ owner: userId });
    if (restaurant) {
      return res.status(400).json({ message: 'Restaurant already created for this user' });
    }

    // Create restaurant
    restaurant = new Restaurant({
      owner: userId,
      name,
      description: description || '',
      cuisineType: cuisineType || [],
      address,
      phone,
    });

    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
};
