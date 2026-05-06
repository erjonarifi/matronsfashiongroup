import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '', image_url: '', stock: ''
};

const CATEGORIES = ['Dresses', 'Blazers', 'Tops', 'Bottoms', 'Accessories', 'Shoes', 'Other'];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      showMsg('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      image_url: product.image_url || '',
      stock: product.stock,
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, form);
        showMsg('Product updated successfully.');
      } else {
        await axios.post('/api/products', form);
        showMsg('Product added successfully.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      showMsg('Product deleted.');
      setDeleteId(null);
    } catch (err) {
      showMsg('Failed to delete product.', 'error');
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    if (newStock < 0) return;
    try {
      await axios.patch(`/api/products/${id}/stock`, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch {
      showMsg('Failed to update stock.', 'error');
    }
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-inner">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your collection</p>
            </div>
            <button className="btn-gold" onClick={() => { cancelForm(); setShowForm(true); }}>
              + Add Product
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalStock}</span>
              <span className="stat-label">Items in Stock</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{ color: outOfStock > 0 ? 'var(--error)' : 'var(--success)' }}>
                {outOfStock}
              </span>
              <span className="stat-label">Out of Stock</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{[...new Set(products.map(p => p.category).filter(Boolean))].length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-body">
        {/* Global Message */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="admin-form-section">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="gold-divider" style={{ margin: '1rem 0', marginLeft: 0 }}></div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Silk Evening Gown"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              {form.image_url && (
                <div className="image-preview">
                  <img src={form.image_url} alt="Preview" onError={e => e.target.style.display='none'} />
                </div>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" className="btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Product Table */}
        <div className="admin-table-section">
          <div className="table-header">
            <h2>All Products</h2>
            <div className="search-wrap" style={{ width: '240px' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Loading Products</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="table-product">
                          <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'}
                            alt={product.name}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'; }}
                          />
                          <div>
                            <p className="table-product-name">{product.name}</p>
                            <p className="table-product-desc">{(product.description || '').slice(0, 60)}...</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag">{product.category || '—'}</span>
                      </td>
                      <td>
                        <span className="price-cell">${parseFloat(product.price).toFixed(2)}</span>
                      </td>
                      <td>
                        <div className="stock-control">
                          <button onClick={() => handleStockUpdate(product.id, product.stock - 1)} disabled={product.stock <= 0}>−</button>
                          <span className={product.stock === 0 ? 'stock-zero' : product.stock <= 5 ? 'stock-low' : ''}>
                            {product.stock}
                          </span>
                          <button onClick={() => handleStockUpdate(product.id, product.stock + 1)}>+</button>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                          {deleteId === product.id ? (
                            <div className="confirm-delete">
                              <button className="btn-danger" onClick={() => handleDelete(product.id)}>Confirm</button>
                              <button className="action-btn" onClick={() => setDeleteId(null)}>Cancel</button>
                            </div>
                          ) : (
                            <button className="action-btn delete-btn" onClick={() => setDeleteId(product.id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
