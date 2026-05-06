import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async (attempt = 1) => {
    try {
      setLoading(true);
      setError(null);

      // If user is logged in as restaurant, redirect to restaurant orders
      if (user?.role === 'restaurant') {
        navigate('/restaurant-orders');
        return;
      }

      // Fetch restaurants from API for customers
      console.log(`🔄 [Attempt ${attempt}] Fetching restaurants...`);
      const response = await restaurantAPI.getAllRestaurants();
      console.log('✅ API Response:', response.status, response.data);
      
      // Extract restaurants from response - try multiple possible keys
      let restaurantsList = [];
      if (response.data?.restaurants && Array.isArray(response.data.restaurants)) {
        restaurantsList = response.data.restaurants;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        restaurantsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        restaurantsList = response.data;
      }
      
      console.log(`✅ Found ${restaurantsList.length} restaurants`);
      
      if (restaurantsList.length === 0) {
        console.warn('⚠️ No restaurants found in response');
      }
      
      setRestaurants(restaurantsList);
      setRetrying(false);
      
    } catch (err) {
      console.error('❌ Error loading restaurants:', err);
      console.error('Response:', err?.response?.data);
      
      const serverMsg = err?.response?.data?.message || 
                       err?.response?.statusText || 
                       err.message;
      const msg = `Network Error: ${serverMsg}. Retry`;
      setError(msg);
      setRestaurants([]);

      // simple retry logic (up to 3 attempts)
      if (attempt < 3) {
        setRetrying(true);
        const backoff = 500 * attempt; // ms
        console.log(`⏳ Retrying in ${backoff}ms...`);
        setTimeout(() => loadRestaurants(attempt + 1), backoff);
      } else {
        setRetrying(false);
        console.error('❌ Max retries reached');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = () => {
    navigate('/create-restaurant');
  };

  if (loading) {
    return <div className="loader">Loading restaurants...</div>;
  }

  // Show restaurant orders page for restaurant users
  if (user?.role === 'restaurant') {
    return null;
  }

  return (
    <div 
      className="home"
      style={{
        backgroundImage: 'url("/images/light-bg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="home-header">
        <div className="header-content">
          <h1>🍽️ Browse Restaurants</h1>
          <p>Discover delicious food from amazing restaurants</p>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
          <div>{error}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => { setRetrying(true); loadRestaurants(1); }} disabled={retrying}>
              {retrying ? 'Retrying…' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {restaurants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏪</div>
          <h2>No Restaurants Available</h2>
          <p>Check back later for available restaurants</p>
        </div>
      ) : (
        <div className="restaurants-container">
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant._id} 
                className="restaurant-item"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>

          <div className="restaurants-footer">
            <p>Total Restaurants: {restaurants.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
