const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const Payment = require('../models/Payment');
const { calculateTax, isValidStatusTransition } = require('../utils/helpers');

// Create order
const createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { restaurantId, items, deliveryAddress, notes } = req.body;

    // Validate input
    if (!restaurantId || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Calculate order total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Calculate taxes and delivery fee
    const tax = calculateTax(subtotal);
    const deliveryFee = restaurant.minOrder > subtotal ? 0 : 50; // Free delivery if below min order
    const total = subtotal + tax + deliveryFee;

    // Get user for phone
    const User = require('../models/User');
    const user = await User.findById(userId);

    // Create order
    const order = new Order({
      customer: userId,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      customerPhone: user.phone,
      notes: notes || '',
      statusHistory: [
        {
          status: 'PLACED',
          timestamp: new Date(),
        },
      ],
    });

    await order.save();

    // Create payment record (mock)
    const payment = new Payment({
      order: order._id,
      amount: total,
      method: 'COD',
      status: 'PENDING',
    });

    await payment.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get order details
const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name image deliveryTime')
      .populate('items.menuItem', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order details fetched successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get order status
const getOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).select('status statusHistory createdAt');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status fetched successfully',
      orderId: id,
      status: order.status,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders
const getCustomerOrders = async (req, res, next) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ customer: userId })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Customer orders fetched successfully',
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Accept order (restaurant only)
const acceptOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify restaurant owns this order
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only accept orders for your restaurant' });
    }

    // Check if valid transition
    if (!isValidStatusTransition(order.status, 'ACCEPTED')) {
      return res.status(400).json({
        message: `Cannot accept order with status ${order.status}`,
      });
    }

    // Update status
    order.status = 'ACCEPTED';
    order.statusHistory.push({
      status: 'ACCEPTED',
      timestamp: new Date(),
      updatedBy: userId,
    });

    await order.save();

    res.json({
      message: 'Order accepted successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (restaurant only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify restaurant owns this order
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update orders for your restaurant' });
    }

    // Check if valid transition
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: userId,
    });

    await order.save();

    res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant orders (restaurant only)
const getRestaurantOrders = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get orders for this restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Restaurant orders fetched successfully',
      orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  getOrderStatus,
  getCustomerOrders,
  acceptOrder,
  updateOrderStatus,
  getRestaurantOrders,
};
