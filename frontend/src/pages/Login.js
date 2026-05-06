import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Image Side */}
        <div className="auth-image">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900" alt="Fashion" />
          <div className="auth-image-overlay">
            <div className="auth-brand">
              <span className="logo-main">Matrons</span>
              <span className="logo-sub">Fashion Group</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-side">
          <div className="auth-form-inner">
            <div className="auth-form-header">
              <h1>Welcome back</h1>
              <p>Sign in to your account to continue</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button className="btn-primary auth-submit" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>

            <div className="admin-hint">
              <p>Admin? Email: <code>admin@matronsfashion.com</code></p>
              <p>Password: <code>admin123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
