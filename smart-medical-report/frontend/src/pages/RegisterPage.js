import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from '../components/LanguageSelector';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', preferredLanguage: 'English', accessibilityNeeds: { visuallyImpaired: false, hearingImpaired: false, physicallyImpaired: false } });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to MedAI');
      navigate('/analyze');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FaHeartbeat color="white" size={28} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#94a3b8' }}>Join MedAI for personalized medical analysis</p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'FULL NAME', type: 'text', field: 'name', icon: <FaUser />, placeholder: 'Your name' },
              { label: 'EMAIL', type: 'email', field: 'email', icon: <FaEnvelope />, placeholder: 'your@email.com' },
              { label: 'PASSWORD', type: 'password', field: 'password', icon: <FaLock />, placeholder: '••••••••' },
            ].map(({ label, type, field, icon, placeholder }) => (
              <div key={field} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>{icon}</span>
                  <input type={type} className="form-input" style={{ paddingLeft: 40 }} placeholder={placeholder}
                    value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 18 }}>
              <LanguageSelector value={form.preferredLanguage} onChange={v => setForm({ ...form, preferredLanguage: v })} label="Preferred Language" />
            </div>

            <div style={{ marginBottom: 24, background: 'rgba(0,212,255,0.04)', borderRadius: 10, padding: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>ACCESSIBILITY NEEDS (Optional)</p>
              {[
                { key: 'visuallyImpaired', label: '👁️ Visually Impaired' },
                { key: 'hearingImpaired', label: '👂 Hearing Impaired' },
                { key: 'physicallyImpaired', label: '♿ Physically Impaired' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.accessibilityNeeds[key]}
                    onChange={e => setForm({ ...form, accessibilityNeeds: { ...form.accessibilityNeeds, [key]: e.target.checked } })}
                    style={{ accentColor: '#00d4ff', width: 16, height: 16 }} />
                  <span style={{ color: '#e2e8f0', fontSize: 14 }}>{label}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#94a3b8', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
