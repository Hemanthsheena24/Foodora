import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refetchInterval, setRefetchInterval] = useState(null);

  useEffect(() => {
    fetchOrderStatus();
    // Refetch status every 10 seconds
    const interval = setInterval(fetchOrderStatus, 10000);
    setRefetchInterval(interval);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderStatus(orderId);
      setStatus(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await orderAPI.getOrderDetails(orderId);
      setOrder(response.data.order);
    } catch (err) {
      console.error('Failed to fetch order details');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading && !status) return <Loader message="Fetching order status..." />;

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const statusSteps = ['PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIndex = statusSteps.indexOf(status?.status);

  const getStatusMessage = (status) => {
    const messages = {
      PLACED: 'Your order has been placed',
      ACCEPTED: 'Restaurant accepted your order',
      PREPARING: 'Your food is being prepared',
      OUT_FOR_DELIVERY: 'Your order is on the way',
      DELIVERED: 'Your order has been delivered',
      CANCELLED: 'Order cancelled',
    };
    return messages[status] || 'Unknown status';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PLACED: '📋',
      ACCEPTED: '✅',
      PREPARING: '👨‍🍳',
      OUT_FOR_DELIVERY: '🚚',
      DELIVERED: '✔️',
      CANCELLED: '❌',
    };
    return icons[status] || '⏳';
  };

  return (
    <div className="order-tracking">
      <div className="tracking-container">
        <h1>Order Tracking</h1>
        <div className="order-id">Order ID: {status?.orderId}</div>

        {/* Status Timeline */}
        <div className="status-timeline">
          {statusSteps.map((step, index) => (
            <div key={step} className={`status-step ${index <= currentStatusIndex ? 'completed' : ''}`}>
              <div className="status-circle">
                {index < currentStatusIndex ? '✓' : index === currentStatusIndex ? '●' : index + 1}
              </div>
              <div className="status-label">{step}</div>
              {index < statusSteps.length - 1 && <div className="status-line"></div>}
            </div>
          ))}
        </div>

        {/* Current Status */}
        <div className="current-status">
          <h2>
            {getStatusIcon(status?.status)} {getStatusMessage(status?.status)}
          </h2>
          <p className="updated-at">Last updated: {new Date(status?.statusHistory[status?.statusHistory.length - 1]?.timestamp).toLocaleString()}</p>
        </div>

        {/* Status History */}
        <div className="status-history">
          <h3>Status History</h3>
          <div className="history-list">
            {status?.statusHistory &&
              status.statusHistory
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div key={index} className="history-item">
                    <span className="history-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className="history-status">{entry.status}</span>
                    <span className="history-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="details-content">
              <div className="detail-group">
                <label>Restaurant:</label>
                <span>{order.restaurant?.name}</span>
              </div>
              <div className="detail-group">
                <label>Items:</label>
                <div className="items-list">
                  {order.items.map((item) => (
                    <div key={item._id} className="detail-item">
                      <span>
                        {item.menuItem?.name} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="detail-group">
                <label>Delivery Address:</label>
                <span>{order.deliveryAddress}</span>
              </div>
            </div>
          </div>
        )}

        <div className="tracking-actions">
          <button onClick={() => navigate('/')} className="home-btn">
            Back to Home
          </button>
          <button onClick={() => navigate('/orders')} className="orders-btn">
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
