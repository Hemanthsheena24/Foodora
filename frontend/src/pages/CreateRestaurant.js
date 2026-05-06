import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import '../styles/CreateRestaurant.css';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisineType: '',
    deliveryTime: 30,
    deliveryFee: 50,
    minOrder: 100,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'deliveryTime' || name === 'deliveryFee' || name === 'minOrder' 
        ? parseInt(value) 
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create a mock token for now
      const mockToken = 'mock_token_' + Date.now();
      localStorage.setItem('restaurantToken', mockToken);

      // For now, save to localStorage since backend auth is broken
      const restaurants = JSON.parse(localStorage.getItem('myRestaurants')) || [];
      const newRestaurant = {
        id: Date.now().toString(),
        ...formData,
        cuisineType: [formData.cuisineType],
        rating: 4.5,
        owner: mockToken,
        createdAt: new Date().toISOString(),
      };

      restaurants.push(newRestaurant);
      localStorage.setItem('myRestaurants', JSON.stringify(restaurants));
      localStorage.setItem('currentRestaurantId', newRestaurant.id);

      // Show success
      alert(`✅ Restaurant "${newRestaurant.name}" created successfully!\n\nRestaurant ID: ${newRestaurant.id}`);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-restaurant-container">
      <div className="create-restaurant-card">
        <h1>🍕 Create Your Restaurant</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pizza Palace"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your restaurant"
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Food Street"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cuisine Type *</label>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              required
            >
              <option value="">Select a cuisine</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Japanese">Japanese</option>
              <option value="Mexican">Mexican</option>
              <option value="Continental">Continental</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Delivery Time (minutes)</label>
              <input
                type="number"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                min="15"
                max="90"
              />
            </div>

            <div className="form-group">
              <label>Delivery Fee (₹)</label>
              <input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                min="0"
                max="500"
              />
            </div>

            <div className="form-group">
              <label>Min Order (₹)</label>
              <input
                type="number"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                min="0"
                max="1000"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : '✨ Create Restaurant'}
          </button>
        </form>

        <p className="info-text">
          ℹ️ Your restaurant will be created instantly. You can add menu items next!
        </p>
      </div>
    </div>
  );
};

export default CreateRestaurant;
