const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is restaurant
const restaurantMiddleware = (req, res, next) => {
  if (req.userRole !== 'restaurant') {
    return res.status(403).json({ message: 'Access denied. Only restaurants can access this' });
  }
  next();
};

// Middleware to check if user is customer
const customerMiddleware = (req, res, next) => {
  if (req.userRole !== 'customer') {
    return res.status(403).json({ message: 'Access denied. Only customers can access this' });
  }
  next();
};

module.exports = { authMiddleware, restaurantMiddleware, customerMiddleware };
