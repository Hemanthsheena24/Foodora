import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍕 FoodHub
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <>
                  <Link to="/cart" className="nav-link">
                    Cart ({cartCount})
                  </Link>
                  <Link to="/orders" className="nav-link">
                    My Orders
                  </Link>
                </>
              )}

              {user?.role === 'restaurant' && (
                <Link to="/restaurant-orders" className="nav-link">
                  Orders
                </Link>
              )}

              <span className="nav-user">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
