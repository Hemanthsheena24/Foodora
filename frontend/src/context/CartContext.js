import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('restaurantId');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (menuItem, quantity, newRestaurantId) => {
    // If adding from a different restaurant, clear cart
    if (restaurantId && restaurantId !== newRestaurantId) {
      if (window.confirm('Switching restaurants will clear your cart. Continue?')) {
        setCart([
          {
            ...menuItem,
            quantity,
          },
        ]);
        setRestaurantId(newRestaurantId);
        localStorage.setItem('restaurantId', newRestaurantId);
      }
      return;
    }

    setRestaurantId(newRestaurantId);
    localStorage.setItem('restaurantId', newRestaurantId);

    const existingItem = cart.find((item) => item._id === menuItem._id);

    if (existingItem) {
      // Update quantity if item exists
      setCart(
        cart.map((item) =>
          item._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      setCart([...cart, { ...menuItem, quantity }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === itemId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    localStorage.removeItem('restaurantId');
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    cartCount: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
