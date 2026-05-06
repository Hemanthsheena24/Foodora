import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import Cart from '../components/Cart';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, restaurantId, clearCart, calculateTotal } = useCart();
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="checkout-error">
        <p>Please login to proceed with checkout</p>
        <button onClick={() => navigate('/login')} className="login-btn">
          Go to Login
        </button>
      </div>
    );
  }

  if (user?.role === 'restaurant') {
    return (
      <div className="checkout-error">
        <p>Restaurants cannot place orders</p>
        <button onClick={() => navigate('/')} className="login-btn">
          Go Home
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-error">
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/')} className="login-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const tax = Math.round((subtotal * 5) / 100);
  const deliveryFee = 50;
  const total = subtotal + tax + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        restaurantId,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress: formData.deliveryAddress,
        notes: formData.notes,
      };

      const response = await orderAPI.createOrder(orderData);
      clearCart();
      navigate(`/order-tracking/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <h2>Delivery Details</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter your delivery address"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any special requests?"
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className="place-order-btn">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="items-list">
              {cart.map((item) => (
                <div key={item._id} className="summary-item">
                  <span>{item.name}</span>
                  <span>
                    ₹{item.price} x {item.quantity}
                  </span>
                  <span className="item-total">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="price-row">
                <span>Tax (5%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="payment-method">
              <label>Payment Method</label>
              <select>
                <option>Cash on Delivery</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
