import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, cartLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [removing, setRemoving] = useState(null);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await removeFromCart(id);
    } finally {
      setRemoving(null);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    await updateQuantity(id, quantity);
  };

  if (cartLoading) {
    return (
      <div className="cart-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading Cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="container cart-layout">
        {cartItems.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Explore our collection and add your favourite pieces</p>
            <Link to="/products" className="btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Items */}
            <div className="cart-items-col">
              <div className="cart-items-header">
                <span>Item</span>
                <span>Qty</span>
                <span>Total</span>
                <span></span>
              </div>
              {cartItems.map(item => (
                <div key={item.id} className={`cart-item ${removing === item.id ? 'removing' : ''}`}>
                  <div className="cart-item-product">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'; }}
                    />
                    <div>
                      <p className="cart-item-category">{item.category}</p>
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="qty-control">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>

                  <p className="cart-item-total">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>

                  <button className="cart-remove-btn" onClick={() => handleRemove(item.id)} title="Remove">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              ))}

              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="gold-divider" style={{ margin: '1rem 0', marginLeft: 0 }}></div>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-free">Free</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button className="btn-primary checkout-btn">Proceed to Checkout</button>
              <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
