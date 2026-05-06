import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Your cart is empty</h3>
        <button onClick={() => navigate('/')} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const tax = Math.round((subtotal * 5) / 100);
  const deliveryFee = 50;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="item-price">₹{item.price}</p>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <div className="cart-item-total">
              <span>₹{item.price * item.quantity}</span>
              <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Tax (5%):</span>
          <span>₹{tax}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee:</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button onClick={() => navigate('/')} className="continue-btn">
          Continue Shopping
        </button>
        <button onClick={() => navigate('/checkout')} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
