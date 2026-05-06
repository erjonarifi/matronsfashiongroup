import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    try {
      setCartLoading(true);
      const res = await axios.get('/api/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
    else setCartItems([]);
  }, [user, fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    const res = await axios.post('/api/cart', { product_id, quantity });
    await fetchCart();
    return res.data;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await axios.put(`/api/cart/${cartItemId}`, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (cartItemId) => {
    await axios.delete(`/api/cart/${cartItemId}`);
    setCartItems(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = async () => {
    await axios.delete('/api/cart');
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartLoading, cartCount, cartTotal,
      addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
