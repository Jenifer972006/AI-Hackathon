import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaPrescription, FaRobot, FaGlobe, FaAccessibleIcon, FaLanguage, FaShieldAlt, FaBrain, FaHeartbeat } from 'react-icons/fa';

const FeatureCard = ({ icon, title, desc, to, color }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div className="glass-card" style={{ padding: 28, cursor: 'pointer', transition: 'all 0.3s', height: '100%' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${color}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.15)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color }}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
    </div>
  </Link>
);

const StatCard = ({ num, label }) => (
  <div style={{ textAlign: 'center', padding: '20px 32px' }}>
    <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
    <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{label}</div>
  </div>
);

const HomePage = () => {
  const features = [
    { icon: <FaFileAlt />, title: 'Digital Report Analysis', desc: 'Upload PDF or image reports and get an instant AI-powered disease analysis with causes, symptoms, prevention, diet guide, and medication breakdown.', to: '/analyze', color: '#00d4ff' },
    { icon: <FaPrescription />, title: 'Handwritten Prescription', desc: 'Upload photos of handwritten prescriptions — no matter how complex the handwriting. Our AI reads and generates complete analysis reports.', to: '/prescription', color: '#7c3aed' },
    { icon: <FaLanguage />, title: 'Multilingual Support', desc: 'Get reports in all 18+ Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Gujarati, and more.', to: '/analyze', color: '#10b981' },
    { icon: <FaRobot />, title: 'AI Medical Chatbot', desc: 'Ask questions about your diagnosis in your native language. Get instant, clear answers from our multilingual medical AI assistant.', to: '/chat', color: '#f59e0b' },
    { icon: <FaAccessibleIcon />, title: 'Accessibility Features', desc: 'Text-to-speech, speech-to-text, and sign language support for visually impaired, hearing impaired, and physically challenged patients.', to: '/accessibility', color: '#ef4444' },
    { icon: <FaBrain />, title: 'Smart Medication Guide', desc: 'Every medication analyzed: why it\'s prescribed, how it helps, exact dosage, and when to take it — morning/evening, before/after food.', to: '/analyze', color: '#06b6d4' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -200, left: -200, width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 30, padding: '8px 18px', marginBottom: 28 }}>
            <FaHeartbeat color="#00d4ff" size={14} />
            <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>AI-Powered Medical Intelligence</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            <span className="gradient-text">Smart Medical</span><br />
            <span style={{ color: '#f1f5f9' }}>Report Analysis</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', lineHeight: 1.7, maxWidth: 650, margin: '0 auto 40px' }}>
            Upload your medical reports and prescriptions. Get instant, accurate, patient-friendly analysis in your language. Designed for everyone — including visually and hearing-impaired patients.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/analyze"><button className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>Analyze My Report →</button></Link>
            <Link to="/prescription"><button className="btn-secondary" style={{ padding: '14px 32px', fontSize: 16 }}>Upload Prescription</button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'rgba(0,212,255,0.03)', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)', padding: '8px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <StatCard num="18+" label="Indian Languages" />
          <StatCard num="2" label="Detailed Reports" />
          <StatCard num="All" label="File Formats Supported" />
          <StatCard num="100%" label="Privacy Protected" />
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
            Everything You Need for <span className="gradient-text">Medical Clarity</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 550, margin: '0 auto' }}>
            Comprehensive medical report analysis with AI — accessible to everyone, in any language.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>

      {/* How it Works */}
      <div style={{ padding: '60px 24px', background: 'rgba(13,27,42,0.5)', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 50 }}>How It <span className="gradient-text">Works</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Upload Report', desc: 'Upload PDF, JPG, PNG, or any format of your medical report or prescription' },
              { step: '02', title: 'AI Processing', desc: 'Gemini AI reads and understands your report with medical precision' },
              { step: '03', title: 'Get 2 Reports', desc: 'Receive detailed disease analysis and medication guide instantly' },
              { step: '04', title: 'In Your Language', desc: 'Translate to any Indian language and use accessibility features' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>{item.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 700, margin: '0 auto', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(124,58,237,0.05))' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Ready to <span className="gradient-text">Understand</span> Your Health?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 28 }}>Free to use. No medical knowledge required. Available in your language.</p>
          <Link to="/analyze"><button className="btn-primary" style={{ padding: '14px 40px', fontSize: 16 }}>Start Free Analysis →</button></Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
