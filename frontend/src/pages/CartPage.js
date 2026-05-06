import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';
import './CartPage.css';

const CartPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="cart-page-container">
        <div className="login-prompt">
          <h2>Please Login to Continue</h2>
          <p>You need to be logged in to view your cart</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="register-btn">
            Register
          </button>
        </div>
      </div>
    );
  }

  if (user?.role === 'restaurant') {
    return (
      <div className="cart-page-container">
        <div className="error-message">
          <h2>Not Available for Restaurants</h2>
          <p>Restaurants cannot place orders</p>
          <button onClick={() => navigate('/')} className="home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {cart.length === 0 ? (
        <div className="empty-cart">
          <h1>🛒 Your Cart is Empty</h1>
          <p>Add some delicious food items to get started</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <Cart />
      )}
    </div>
  );
};

export default CartPage;
