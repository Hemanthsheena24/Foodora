const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address, restaurantName, restaurantDescription } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      role,
      address: address || '',
    });

    // Add restaurant details if role is restaurant
    if (role === 'restaurant') {
      user.restaurantName = restaurantName || name;
      user.restaurantDescription = restaurantDescription || '';
    }

    // Save user
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log(`Login attempt - Email: ${email}, Password valid: ${isPasswordValid}`);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
