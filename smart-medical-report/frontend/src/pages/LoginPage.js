import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/analyze');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FaHeartbeat color="white" size={28} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8' }}>Sign in to access your medical reports</p>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                <input type="email" className="form-input" style={{ paddingLeft: 40 }} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                <input type="password" className="form-input" style={{ paddingLeft: 40 }} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16 }} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#94a3b8', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>

          <div style={{ marginTop: 20, padding: '16px', background: 'rgba(0,212,255,0.05)', borderRadius: 10, border: '1px solid rgba(0,212,255,0.1)' }}>
            <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center' }}>
              You can also use MedAI without an account. <Link to="/analyze" style={{ color: '#00d4ff' }}>Analyze report →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
