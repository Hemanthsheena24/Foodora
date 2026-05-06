const MenuItem = require('../models/MenuItem');

// Get all menu items for a restaurant
const getMenuItems = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await MenuItem.find({ restaurant: restaurantId, isAvailable: true }).sort({
      category: 1,
    });

    res.json({
      message: 'Menu items fetched successfully',
      menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// Create menu item (restaurant only)
const createMenuItem = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { restaurantId, name, description, category, price, preparationTime } = req.body;

    // Validate input
    if (!name || !category || !price || !restaurantId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if restaurant belongs to user
    const Restaurant = require('../models/Restaurant');
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only add items to your own restaurant' });
    }

    // Create menu item
    const menuItem = new MenuItem({
      restaurant: restaurantId,
      name,
      description: description || '',
      category,
      price,
      preparationTime: preparationTime || 15,
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// Update menu item (restaurant only)
const updateMenuItem = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, description, category, price, isAvailable, preparationTime } = req.body;

    // Find menu item
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if restaurant belongs to user
    const Restaurant = require('../models/Restaurant');
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit items in your own restaurant' });
    }

    // Update menu item
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (category) menuItem.category = category;
    if (price) menuItem.price = price;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (preparationTime) menuItem.preparationTime = preparationTime;

    await menuItem.save();

    res.json({
      message: 'Menu item updated successfully',
      menuItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
};
