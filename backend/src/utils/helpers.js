const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Calculate tax (assuming 5% tax)
const calculateTax = (subtotal) => {
  return (subtotal * 5) / 100;
};

// Validate order status transition
const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    PLACED: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['OUT_FOR_DELIVERY'],
    OUT_FOR_DELIVERY: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
  generateToken,
  calculateTax,
  isValidStatusTransition,
};
