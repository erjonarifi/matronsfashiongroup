import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Dresses', 'Blazers', 'Tops', 'Bottoms', 'Accessories', 'Shoes'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (search) params.search = search;
        const res = await axios.get('/api/products', { params });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [activeCategory, search]);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>The Collection</h1>
        <p>Crafted for the discerning woman</p>
      </div>

      <div className="products-layout container">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-bar">
          <span className="results-count">
            {loading ? '' : `${products.length} piece${products.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading Collection</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No pieces found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn-secondary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <div key={product.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
