import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getCustomerOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'customer') {
    return (
      <div className="error-container">
        <p>Please login as customer to view orders</p>
      </div>
    );
  }

  if (loading) return <Loader message="Loading your orders..." />;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>

        {error && <p className="error-message">{error}</p>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet</p>
            <a href="/" className="start-shopping">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>{order.restaurant?.name}</h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="order-details">
                  <div className="detail-row">
                    <span>Order ID:</span>
                    <span>{order._id}</span>
                  </div>
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Items:</span>
                    <span>{order.items.length} item(s)</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
                <div className="order-actions">
                  <a href={`/order-tracking/${order._id}`} className="track-btn">
                    Track Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
