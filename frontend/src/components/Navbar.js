import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-main">Matrons</span>
          <span className="logo-sub">Fashion Group</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Collection</Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-link nav-admin ${isActive('/admin') ? 'active' : ''}`}>
              Admin
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <>
              <span className="nav-username">{user.name.split(' ')[0]}</span>
              {!isAdmin && (
                <Link to="/cart" className="nav-cart">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              )}
              <button className="btn-secondary nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary nav-btn">Login</Link>
              <Link to="/register" className="btn-primary nav-btn">Join</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>Collection</Link>
        {isAdmin && (
          <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
        )}
        {user ? (
          <>
            {!isAdmin && (
              <Link to="/cart" className="mobile-link" onClick={() => setMenuOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            )}
            <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
