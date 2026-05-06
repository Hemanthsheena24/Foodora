import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  // Get actual image from backend - properly encode the image path
  const getImageUrl = () => {
    if (!restaurant.image) {
      return '/images/restaurants/default.jpg';
    }
    
    // If it's already an external URL, use as-is
    if (restaurant.image.startsWith('http')) {
      return restaurant.image;
    }
    
    // If it doesn't start with /, add it and prefix with backend URL
    if (!restaurant.image.startsWith('/')) {
      return `${IMAGE_BASE}/images/restaurants/${encodeURI(restaurant.image)}`;
    }
    
    // Prefix with backend URL for relative paths
    return IMAGE_BASE + restaurant.image;
  };

  return (
    <div className="restaurant-card" onClick={handleClick}>
      <div className="restaurant-image">
        <img 
          src={getImageUrl()} 
          alt={restaurant.name}
          onError={(e) => {
            console.error(`Failed to load image: ${getImageUrl()}`);
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#FF6B6B;"><div style="color:white; font-size:3rem;">🍽️</div></div>`;
          }}
          onLoad={() => {
            console.log(`✅ Image loaded: ${getImageUrl()}`);
          }}
        />
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="cuisine">{restaurant.cuisineType?.join(', ')}</p>
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="delivery-time">🚚 {restaurant.deliveryTime} min</span>
        </div>
        <p className="description">{restaurant.description}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
