import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400"
            alt="Fashion"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">New Collection 2025</p>
          <h1 className="hero-title">
            Dressed for<br />
            <em>Every Chapter</em>
          </h1>
          <p className="hero-subtitle">
            Curated luxury fashion for the woman who commands every room she enters.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary hero-cta">Shop Collection</Link>
            <Link to="/register" className="btn-secondary hero-cta-secondary">Join the Group</Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <h3>Curated Selection</h3>
              <p>Every piece is handpicked for quality, elegance, and timeless appeal.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">◈</div>
              <h3>Premium Quality</h3>
              <p>Luxury fabrics and craftsmanship that last a lifetime.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">◇</div>
              <h3>Exclusive Access</h3>
              <p>Members enjoy early access to new arrivals and seasonal collections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Browse by Category</p>
            <h2 className="section-title">The Collection</h2>
            <div className="gold-divider"></div>
          </div>
          <div className="categories-grid">
            {[
              { name: 'Dresses', img: 'https://images.unsplash.com/photo-1566479179817-e1b05f47c3c1?w=600', query: 'Dresses' },
              { name: 'Blazers', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', query: 'Blazers' },
              { name: 'Accessories', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', query: 'Accessories' },
              { name: 'Shoes', img: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600', query: 'Shoes' },
            ].map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.query}`} className="category-card">
                <img src={cat.img} alt={cat.name} />
                <div className="category-overlay">
                  <span>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <p className="section-label" style={{ color: 'var(--gold)' }}>Become a Member</p>
          <h2>Join Matrons Fashion Group</h2>
          <p>Create an account to shop, save your favourites, and track your orders.</p>
          <Link to="/register" className="btn-gold">Create Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">
            <span className="logo-main">Matrons</span>
            <span className="logo-sub">Fashion Group</span>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Matrons Fashion Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
