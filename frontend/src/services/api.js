import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IMAGE_BASE = API_URL.replace(/\/api\/?$/i, '');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Restaurant API calls
export const restaurantAPI = {
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  getRestaurantMenu: (id) => api.get(`/restaurants/${id}/menu`),
  createRestaurant: (data) => api.post('/restaurants', data),
};

// Menu API calls
export const menuAPI = {
  getMenuItems: (restaurantId) => api.get(`/menu/${restaurantId}`),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
};

// Order API calls
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrderDetails: (id) => api.get(`/orders/${id}`),
  getOrderStatus: (id) => api.get(`/orders/${id}/status`),
  getCustomerOrders: () => api.get('/orders/customer/my-orders'),
  acceptOrder: (id) => api.post(`/orders/${id}/accept`),
  updateOrderStatus: (id, data) => api.post(`/orders/${id}/update-status`, data),
  getRestaurantOrders: () => api.get('/orders/restaurant/my-orders'),
};

export default api;
export { API_URL, IMAGE_BASE };
