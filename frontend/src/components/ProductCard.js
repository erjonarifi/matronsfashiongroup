import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isAdmin) return;

    setAdding(true);
    setError('');
    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const outOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500'}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500'; }}
        />
        {outOfStock && <div className="sold-out-badge">Sold Out</div>}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="low-stock-badge">Only {product.stock} left</div>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
          {!isAdmin && (
            <button
              className={`add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={outOfStock || adding || added}
            >
              {added ? '✓ Added' : adding ? '...' : outOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          )}
        </div>
        {error && <p className="product-error">{error}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
