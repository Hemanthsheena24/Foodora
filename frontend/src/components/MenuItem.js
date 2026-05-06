import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { IMAGE_BASE } from '../services/api';
import './MenuItem.css';

const MenuItem = ({ menuItem, restaurantId }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(menuItem, quantity, restaurantId);
    setQuantity(1);
    alert('Item added to cart!');
  };

  // Get actual image from backend - properly encode the image path
  const getImageUrl = () => {
    if (!menuItem.image) {
      return '/images/menu-items/default.jpg';
    }
    
    // If it's already an external URL, use as-is
    if (menuItem.image.startsWith('http')) {
      return menuItem.image;
    }
    
    // If it doesn't start with /, add it and prefix with backend URL
    if (!menuItem.image.startsWith('/')) {
      return `${IMAGE_BASE}/images/menu-items/${encodeURI(menuItem.image)}`;
    }
    
    // Prefix with backend URL for relative paths
    return IMAGE_BASE + menuItem.image;
  };

  return (
    <div className="menu-item">
      <div className="menu-item-image">
        <img 
          src={getImageUrl()} 
          alt={menuItem.name}
          onError={(e) => {
            console.error(`Failed to load image: ${getImageUrl()}`);
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#4ECDC4;"><div style="color:white; font-size:2.5rem;">🍲</div></div>`;
          }}
          onLoad={() => {
            console.log(`✅ Image loaded: ${getImageUrl()}`);
          }}
        />
      </div>
      <div className="menu-item-info">
        <h4>{menuItem.name}</h4>
        <p className="category">{menuItem.category}</p>
        <p className="description">{menuItem.description}</p>
        <div className="menu-item-footer">
          <span className="price">₹{menuItem.price}</span>
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button onClick={handleAddToCart} className="add-btn">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
