import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import MenuItem from '../components/MenuItem';
import Loader from '../components/Loader';
import './RestaurantMenu.css';
import { IMAGE_BASE } from '../services/api';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getRestaurantById(id),
        restaurantAPI.getRestaurantMenu(id),
      ]);
      setRestaurant(restaurantRes.data.restaurant);
      setMenuItems(menuRes.data.menuItems);

      // Set first category as selected
      if (menuRes.data.menuItems.length > 0) {
        setSelectedCategory(menuRes.data.menuItems[0].category);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading menu..." />;

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  if (!restaurant) return <div>Restaurant not found</div>;

  // Get unique categories
  const categories = [...new Set(menuItems.map((item) => item.category))];

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="restaurant-menu">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <img src={restaurant.image && !restaurant.image.startsWith('http') ? IMAGE_BASE + restaurant.image : restaurant.image} alt={restaurant.name} className="header-image" />
        <div className="restaurant-details">
          <h1>{restaurant.name}</h1>
          <p className="description">{restaurant.description}</p>
          <div className="meta-info">
            <span>⭐ {restaurant.rating}</span>
            <span>🚚 {restaurant.deliveryTime} min delivery</span>
            <span>💵 Min order: ₹{restaurant.minOrder}</span>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-container">
        {/* Categories Sidebar */}
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items-container">
          <h2>{selectedCategory}</h2>
          {filteredItems.length === 0 ? (
            <p className="no-items">No items in this category</p>
          ) : (
            <div className="menu-items-grid">
              {filteredItems.map((item) => (
                <MenuItem key={item._id} menuItem={item} restaurantId={id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
