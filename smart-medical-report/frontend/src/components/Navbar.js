import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaHeartbeat, FaAccessibleIcon } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/analyze', label: 'Analyze Report' },
    { to: '/prescription', label: 'Prescription' },
    { to: '/history', label: 'My Reports' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/accessibility', label: 'Accessibility' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(2, 8, 18, 0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
      padding: '0 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', borderRadius: 10, padding: 8, display: 'flex' }}>
            <FaHeartbeat color="white" size={20} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MedAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: isActive(link.to) ? '#00d4ff' : '#94a3b8',
              textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: isActive(link.to) ? 'rgba(0,212,255,0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>Hi, {user.name?.split(' ')[0]}</span>
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;