import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaDeaf, FaWheelchair, FaMicrophone, FaVolumeUp, FaHandPaper } from 'react-icons/fa';
import { chatQuery } from '../utils/api';
import LanguageSelector from '../components/LanguageSelector';

const AccessibilityPage = () => {
  const [mode, setMode] = useState(null); // 'visual', 'hearing', 'physical'
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Voice not supported in this browser. Try Chrome.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.onresult = async (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setQuery(voiceQuery);
      setListening(false);
      await processQuery(voiceQuery);
    };
    recognition.onerror = () => { setListening(false); toast.error('Voice error. Please try again.'); };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    toast.info('Listening... Please speak your question');
  };

  const processQuery = async (queryText) => {
    setLoading(true);
    setResponse('');
    try {
      const { data } = await chatQuery({ query: queryText, language });
      setResponse(data.answer);
      // Auto-speak response for visually impaired
      if (mode === 'visual') {
        speakResponse(data.answer);
      }
    } catch (err) {
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const AccessMode = ({ id, icon, title, desc, color }) => (
    <div
      className="glass-card"
      onClick={() => setMode(id)}
      style={{
        padding: 28, cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
        borderColor: mode === id ? color : 'rgba(0,212,255,0.15)',
        background: mode === id ? `${color}08` : 'rgba(13,27,42,0.8)',
        transform: mode === id ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color }}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
      {mode === id && <div style={{ marginTop: 12, color, fontSize: 12, fontWeight: 700 }}>✓ ACTIVE MODE</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            ♿ <span className="gradient-text">Accessibility</span> Features
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Designed for visually impaired, hearing impaired, and physically challenged patients
          </p>
        </div>

        {/* Mode Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 36 }}>
          <AccessMode id="visual" icon={<FaEye />} title="Visually Impaired" desc="Voice-first interface. Ask questions by speaking and receive audio responses automatically." color="#00d4ff" />
          <AccessMode id="hearing" icon={<FaDeaf />} title="Hearing Impaired" desc="Text-based interface with large, clear text. Visual indicators for all feedback." color="#10b981" />
          <AccessMode id="physical" icon={<FaWheelchair />} title="Physically Challenged" desc="Optimized for limited mobility. Voice commands and simplified navigation." color="#a78bfa" />
        </div>

        {/* Language */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <LanguageSelector value={language} onChange={setLanguage} label="Your Preferred Language" />
        </div>

        {/* Active Mode Interface */}
        {mode && (
          <div className="glass-card" style={{ padding: 32 }}>
            {/* Visual Impaired Mode */}
            {mode === 'visual' && (
              <div>
                <h2 style={{ color: '#00d4ff', marginBottom: 6, fontSize: 22 }}>👁️ Visually Impaired Mode</h2>
                <p style={{ color: '#94a3b8', marginBottom: 28 }}>Speak your question. The AI will understand and respond with voice automatically.</p>

                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <button
                    onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : startVoiceInput}
                    style={{
                      width: 120, height: 120, borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: listening ? 'radial-gradient(circle, rgba(239,68,68,0.3), rgba(239,68,68,0.1))' : 'radial-gradient(circle, rgba(0,212,255,0.3), rgba(0,212,255,0.1))',
                      border: `3px solid ${listening ? '#ef4444' : '#00d4ff'}`,
                      color: listening ? '#ef4444' : '#00d4ff',
                      fontSize: 40, animation: listening ? 'pulse 1s infinite' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                    }}
                  >
                    <FaMicrophone />
                  </button>
                  <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 15 }}>
                    {listening ? '🔴 Listening... Speak now' : 'Click to speak your question'}
                  </p>
                </div>

                {query && (
                  <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>YOUR QUESTION:</p>
                    <p style={{ color: '#f1f5f9', fontSize: 18 }}>{query}</p>
                  </div>
                )}

                {loading && <div style={{ textAlign: 'center', padding: 20 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}

                {response && (
                  <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: 20 }}>
                    <p style={{ color: '#10b981', fontWeight: 700, marginBottom: 10, fontSize: 14 }}>AI RESPONSE:</p>
                    <p style={{ color: '#f1f5f9', fontSize: 18, lineHeight: 1.8 }}>{response}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button className="btn-primary" onClick={() => speakResponse(response)} style={{ flex: 1 }}>
                        <FaVolumeUp style={{ marginRight: 8 }} /> Read Response Again
                      </button>
                      {isSpeaking && (
                        <button className="btn-secondary" onClick={stopSpeaking} style={{ flex: 1 }}>Stop</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hearing Impaired Mode */}
            {mode === 'hearing' && (
              <div>
                <h2 style={{ color: '#10b981', marginBottom: 6, fontSize: 22 }}>👂 Hearing Impaired Mode</h2>
                <p style={{ color: '#94a3b8', marginBottom: 24 }}>Type your questions. All responses are displayed as large, clear text.</p>

                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type your medical question here..."
                  className="form-input"
                  style={{ minHeight: 100, resize: 'vertical', fontSize: 18, lineHeight: 1.6, marginBottom: 16 }}
                />

                <button className="btn-primary" onClick={() => processQuery(query)} disabled={!query.trim() || loading}
                  style={{ width: '100%', padding: '16px', fontSize: 16, background: 'linear-gradient(135deg, #10b981, #059669)', marginBottom: 20 }}>
                  {loading ? 'Getting Answer...' : 'Get Answer →'}
                </button>

                {response && (
                  <div style={{ background: 'rgba(16,185,129,0.05)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 28 }}>
                    <p style={{ color: '#10b981', fontWeight: 700, marginBottom: 16, fontSize: 16 }}>📝 AI RESPONSE:</p>
                    <p style={{ color: '#f1f5f9', fontSize: 22, lineHeight: 1.9 }}>{response}</p>
                  </div>
                )}
              </div>
            )}

            {/* Physical Challenge Mode */}
            {mode === 'physical' && (
              <div>
                <h2 style={{ color: '#a78bfa', marginBottom: 6, fontSize: 22 }}>♿ Physically Challenged Mode</h2>
                <p style={{ color: '#94a3b8', marginBottom: 24 }}>Voice commands and simplified one-touch interface for easy interaction.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  {[
                    { q: 'What are my medications?', label: '💊 My Medications' },
                    { q: 'What should I eat?', label: '🥗 Food Guide' },
                    { q: 'What are my symptoms?', label: '🤒 My Symptoms' },
                    { q: 'How to take my medicines?', label: '⏰ Medicine Timing' }
                  ].map((item, i) => (
                    <button key={i} onClick={() => { setQuery(item.q); processQuery(item.q); }}
                      style={{ padding: '20px 16px', borderRadius: 14, border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(124,58,237,0.08)', color: '#e2e8f0', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {item.label}
                    </button>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <button onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : startVoiceInput}
                    style={{ padding: '18px 40px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700,
                      background: listening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                      color: 'white', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                    <FaMicrophone size={22} />
                    {listening ? 'Stop Listening' : 'Tap to Speak'}
                  </button>
                </div>

                {loading && <div style={{ textAlign: 'center', padding: 20 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}

                {response && (
                  <div style={{ background: 'rgba(124,58,237,0.05)', border: '2px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 24 }}>
                    <p style={{ color: '#f1f5f9', fontSize: 20, lineHeight: 1.8 }}>{response}</p>
                    <button className="btn-primary" onClick={() => speakResponse(response)} style={{ marginTop: 16, width: '100%', padding: '14px', fontSize: 16 }}>
                      <FaVolumeUp style={{ marginRight: 8 }} /> Hear This Response
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sign Language info */}
        <div className="glass-card" style={{ marginTop: 24, padding: 28, background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <FaHandPaper color="#f59e0b" size={24} />
            <h3 style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700 }}>Sign Language Support</h3>
          </div>
          <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
            Our platform supports Indian Sign Language (ISL) through integration with the ISL dictionary. 
            Medical terms and report content can be translated into ISL for hearing-impaired patients. 
            The AI chatbot provides visual text responses optimized for deaf and hard-of-hearing users, 
            with large fonts, clear visual indicators, and no audio-dependent features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;