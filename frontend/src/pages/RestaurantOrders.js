import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'restaurant') {
      fetchOrders();
      // Refresh orders every 10 seconds
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(false); // Only show loader on first load
      const response = await orderAPI.getRestaurantOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderAPI.acceptOrder(orderId);
      fetchOrders();
      alert('Order accepted');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      fetchOrders();
      setSelectedOrder(null);
      alert('Order status updated');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (!isAuthenticated || user?.role !== 'restaurant') {
    return (
      <div className="error-container">
        <p>Please login as restaurant to view orders</p>
      </div>
    );
  }

  if (loading) return <Loader message="Loading orders..." />;

  // Group orders by status
  const ordersGrouped = {
    PLACED: orders.filter((o) => o.status === 'PLACED'),
    ACCEPTED: orders.filter((o) => o.status === 'ACCEPTED'),
    PREPARING: orders.filter((o) => o.status === 'PREPARING'),
    OUT_FOR_DELIVERY: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY'),
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED'),
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      PLACED: ['ACCEPTED'],
      ACCEPTED: ['PREPARING'],
      PREPARING: ['OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="restaurant-orders-page">
      <div className="orders-container">
        <h1>📋 Restaurant Orders Management</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-label">New Orders</span>
            <span className="stat-count">{ordersGrouped.PLACED.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Preparing</span>
            <span className="stat-count">{ordersGrouped.PREPARING.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">On Delivery</span>
            <span className="stat-count">{ordersGrouped.OUT_FOR_DELIVERY.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <span className="stat-count">{ordersGrouped.DELIVERED.length}</span>
          </div>
        </div>

        <div className="orders-section">
          <h2>New Orders 🔔</h2>
          {ordersGrouped.PLACED.length === 0 ? (
            <p className="no-orders">No new orders</p>
          ) : (
            <div className="orders-grid">
              {ordersGrouped.PLACED.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <span className="time">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="order-customer">
                    <strong>{order.customer?.name}</strong>
                    <p>{order.customer?.phone}</p>
                  </div>
                  <div className="order-items">
                    <strong>Items:</strong>
                    {order.items.map((item) => (
                      <div key={item._id} className="item">
                        {item.menuItem?.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="order-total">Total: ₹{order.total}</div>
                  <div className="delivery-address">
                    <strong>📍</strong> {order.deliveryAddress}
                  </div>
                  {order.notes && (
                    <div className="notes">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className="accept-btn"
                  >
                    Accept Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {['ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY'].map((status) => (
          <div key={status} className="orders-section">
            <h2>{status.replace(/_/g, ' ')}</h2>
            {ordersGrouped[status].length === 0 ? (
              <p className="no-orders">No orders in this status</p>
            ) : (
              <div className="orders-grid">
                {ordersGrouped[status].map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <h4>Order #{order._id.slice(-6)}</h4>
                      <span className="status">{status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="order-customer">
                      <strong>{order.customer?.name}</strong>
                      <p>{order.customer?.phone}</p>
                    </div>
                    <div className="order-items">
                      <strong>Items:</strong>
                      {order.items.map((item) => (
                        <div key={item._id} className="item">
                          {item.menuItem?.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                    <div className="order-total">Total: ₹{order.total}</div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order._id);
                        setStatusUpdate(getNextStatus(status)[0]);
                      }}
                      className="update-btn"
                    >
                      Update Status
                    </button>
                    {selectedOrder === order._id && (
                      <div className="status-options">
                        {getNextStatus(status).map((newStatus) => (
                          <button
                            key={newStatus}
                            onClick={() => handleUpdateStatus(order._id, newStatus)}
                            className="status-option-btn"
                          >
                            Move to {newStatus.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="orders-section">
          <h2>Completed Orders ✅</h2>
          {ordersGrouped.DELIVERED.length === 0 ? (
            <p className="no-orders">No completed orders</p>
          ) : (
            <div className="orders-grid">
              {ordersGrouped.DELIVERED.slice(0, 5).map((order) => (
                <div key={order._id} className="order-card completed">
                  <div className="order-header">
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <span className="completed-badge">Delivered</span>
                  </div>
                  <div className="order-customer">
                    <strong>{order.customer?.name}</strong>
                  </div>
                  <div className="order-total">Total: ₹{order.total}</div>
                  <span className="delivery-time">
                    Delivered at {new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrders;
