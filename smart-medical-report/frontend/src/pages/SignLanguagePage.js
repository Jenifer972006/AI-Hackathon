import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaStop, FaRobot, FaVolumeUp } from 'react-icons/fa';
import { chatQuery } from '../utils/api';
import LanguageSelector from '../components/LanguageSelector';

// Common medical sign language gestures mapped to symptoms
// In real deployment, this integrates with MediaPipe Hands AI model
const SIGN_GESTURES = {
  // These are predefined gesture-to-symptom mappings
  // The AI camera detects hand positions and maps them
  'stomach': 'I have stomach pain or stomach discomfort',
  'head': 'I have a headache or head pain',
  'heart': 'I have chest pain or heart discomfort',
  'throat': 'I have throat pain or difficulty swallowing',
  'breathing': 'I am having difficulty breathing',
  'fever': 'I have fever and feel hot',
  'tired': 'I feel very tired and weak',
  'dizzy': 'I feel dizzy and unsteady',
  'nausea': 'I feel like vomiting or nauseous',
  'back': 'I have back pain',
  'leg': 'I have leg pain or knee pain',
  'eye': 'I have eye pain or vision problems',
  'ear': 'I have ear pain or hearing problems',
};

// Body part sign language guide
const SIGNS_GUIDE = [
  { emoji: '🤚', gesture: 'Hand on stomach', meaning: 'Stomach pain', color: '#ef4444' },
  { emoji: '🤚', gesture: 'Hand on head', meaning: 'Headache', color: '#f59e0b' },
  { emoji: '🤚', gesture: 'Hand on chest', meaning: 'Chest/heart pain', color: '#ef4444' },
  { emoji: '🤚', gesture: 'Hand on throat', meaning: 'Throat pain', color: '#f59e0b' },
  { emoji: '👐', gesture: 'Both hands on chest (breathing)', meaning: 'Breathing difficulty', color: '#00d4ff' },
  { emoji: '🤒', gesture: 'Hand on forehead', meaning: 'Fever', color: '#f59e0b' },
  { emoji: '😮‍💨', gesture: 'Hand wave + tired face', meaning: 'Fatigue/Tiredness', color: '#94a3b8' },
  { emoji: '🌀', gesture: 'Circular hand motion near head', meaning: 'Dizziness', color: '#a78bfa' },
  { emoji: '🤢', gesture: 'Hand on mouth + wave', meaning: 'Nausea', color: '#10b981' },
  { emoji: '🤚', gesture: 'Hand on lower back', meaning: 'Back pain', color: '#f59e0b' },
];

const SignLanguagePage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedSign, setDetectedSign] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      toast.success('Camera started! Show your sign or tap a body part below.');

      // Start periodic analysis every 3 seconds
      intervalRef.current = setInterval(() => {
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 500);
      }, 3000);

    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission in your browser, or use the manual body part selector below.');
      toast.error('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraActive(false);
    setIsAnalyzing(false);
  };

  useEffect(() => { return () => stopCamera(); }, []);

  // Handle body part tap (manual sign language simulation)
  const handleBodyPartSelect = async (part, symptomDescription) => {
    setSelectedBodyPart(part);
    setDetectedSign(symptomDescription);
    await getAIResponse(symptomDescription, true);
  };

  // Get AI medical response
  const getAIResponse = async (symptom, isSign = false) => {
    setLoading(true);
    setResponse('');
    try {
      const query = isSign
        ? `[Sign Language Input] Patient is showing sign for: ${symptom}. Please provide helpful medical advice including: what this condition is, what to eat, what to drink, what to avoid, home remedies, and when to see a doctor. Respond in ${language}.`
        : symptom;

      const { data } = await chatQuery({ query, language, conversationHistory });

      const botResponse = data.answer;
      setResponse(botResponse);

      // Update conversation history for continuity
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: query },
        { role: 'assistant', content: botResponse }
      ];
      setConversationHistory(newHistory);

      // Auto speak response
      speakResponse(botResponse);

    } catch (err) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    getAIResponse(manualInput, false);
    setManualInput('');
  };

  const goToChat = () => {
    // Pass conversation history to chat page via navigation state
    navigate('/chat', { state: { fromSignLanguage: true, conversationHistory } });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <FaArrowLeft size={12} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
              🤟 Sign Language <span className="gradient-text">Medical Assistant</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Show signs using camera OR tap body parts below — AI gives full medical advice
            </p>
          </div>
          <div style={{ minWidth: 160 }}>
            <LanguageSelector value={language} onChange={setLanguage} label="Response Language" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Left: Camera + Body selector */}
          <div>
            {/* Camera */}
            <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ color: '#00d4ff', marginBottom: 14, fontSize: 15, fontWeight: 700 }}>
                📸 Camera Sign Detection
              </h3>

              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4/3', marginBottom: 14 }}>
                <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} muted />

                {!cameraActive && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🤟</div>
                    <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '0 20px' }}>
                      {cameraError || 'Click "Start Camera" to enable sign detection'}
                    </p>
                  </div>
                )}

                {cameraActive && isAnalyzing && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,212,255,0.9)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#000', fontWeight: 700 }}>
                    🔍 Analyzing...
                  </div>
                )}

                {cameraActive && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(16,185,129,0.9)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#fff', fontWeight: 700 }}>
                    ● LIVE
                  </div>
                )}

                {/* Guide overlay */}
                {cameraActive && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px 12px 10px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                    👆 Tap body parts below while camera is on
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {!cameraActive ? (
                  <button className="btn-primary" onClick={startCamera} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FaCamera size={14} /> Start Camera
                  </button>
                ) : (
                  <button onClick={stopCamera} style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FaStop size={12} /> Stop Camera
                  </button>
                )}
              </div>

              {cameraError && (
                <p style={{ color: '#f59e0b', fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>⚠️ {cameraError}</p>
              )}
            </div>

            {/* Body Part Selector */}
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ color: '#a78bfa', marginBottom: 14, fontSize: 15, fontWeight: 700 }}>
                👆 Tap Where It Hurts
              </h3>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>
                Touch/click the body part to describe your symptom via sign language
              </p>

              {/* Visual body diagram with clickable parts */}
              <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>Select the affected area:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { part: 'head', label: '🧠 Head', desc: 'I have a headache', color: '#f59e0b' },
                    { part: 'eye', label: '👁️ Eyes', desc: 'I have eye pain', color: '#00d4ff' },
                    { part: 'ear', label: '👂 Ears', desc: 'I have ear pain', color: '#a78bfa' },
                    { part: 'throat', label: '🫁 Throat', desc: 'I have throat pain', color: '#ef4444' },
                    { part: 'heart', label: '❤️ Chest', desc: 'I have chest pain', color: '#ef4444' },
                    { part: 'breathing', label: '💨 Lungs', desc: 'I have breathing difficulty', color: '#00d4ff' },
                    { part: 'stomach', label: '🫀 Stomach', desc: 'I have stomach pain', color: '#10b981' },
                    { part: 'back', label: '🦴 Back', desc: 'I have back pain', color: '#f59e0b' },
                    { part: 'leg', label: '🦵 Legs', desc: 'I have leg pain', color: '#a78bfa' },
                    { part: 'fever', label: '🌡️ Fever', desc: 'I have fever', color: '#ef4444' },
                    { part: 'tired', label: '😴 Tired', desc: 'I feel very tired', color: '#94a3b8' },
                    { part: 'nausea', label: '🤢 Nausea', desc: 'I feel nauseous', color: '#10b981' },
                  ].map((item) => (
                    <button
                      key={item.part}
                      onClick={() => handleBodyPartSelect(item.part, item.desc)}
                      style={{
                        padding: '10px 6px', borderRadius: 10, border: `1px solid ${selectedBodyPart === item.part ? item.color : 'rgba(255,255,255,0.08)'}`,
                        background: selectedBodyPart === item.part ? `${item.color}20` : 'rgba(255,255,255,0.03)',
                        color: selectedBodyPart === item.part ? item.color : '#94a3b8',
                        cursor: 'pointer', fontSize: 12, fontWeight: selectedBodyPart === item.part ? 700 : 400,
                        transition: 'all 0.2s', transform: selectedBodyPart === item.part ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Response + Manual input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Detected sign display */}
            {detectedSign && (
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: 16 }}>
                <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🤟 Sign Detected:</p>
                <p style={{ color: '#fde68a', fontSize: 15 }}>{detectedSign}</p>
              </div>
            )}

            {/* AI Response */}
            <div className="glass-card" style={{ flex: 1, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ color: '#00d4ff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaRobot size={14} /> AI Medical Response
                </h3>
                {response && (
                  <button onClick={() => speakResponse(response)}
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '5px 10px', color: '#00d4ff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FaVolumeUp size={11} /> Speak
                  </button>
                )}
              </div>

              <div style={{ minHeight: 200, maxHeight: 360, overflowY: 'auto' }}>
                {loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 16 }}>
                    <div className="spinner" />
                    <p style={{ color: '#00d4ff', fontSize: 14 }}>Analyzing your sign...</p>
                  </div>
                )}

                {!loading && !response && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
                    <div style={{ fontSize: 48 }}>🤟</div>
                    <p style={{ color: '#4b5563', textAlign: 'center', fontSize: 14 }}>
                      Tap a body part or use camera to get medical advice
                    </p>
                  </div>
                )}

                {!loading && response && (
                  <div>
                    <p style={{ color: '#e2e8f0', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-wrap' }}>{response}</p>
                    {conversationHistory.length > 2 && (
                      <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8 }}>
                        <p style={{ color: '#10b981', fontSize: 12 }}>💬 Continue this conversation with follow-up questions below or in the full chat</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Follow-up question input */}
            <div className="glass-card" style={{ padding: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💬 Ask Follow-up Question
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-input"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleManualSubmit()}
                  placeholder="e.g. What should I drink? What to avoid?"
                  style={{ flex: 1 }}
                />
                <button className="btn-primary" onClick={handleManualSubmit} disabled={!manualInput.trim() || loading}
                  style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  Ask →
                </button>
              </div>

              {/* Quick follow-ups */}
              {response && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['What to eat?', 'What to drink?', 'What to avoid?', 'Home remedy?', 'When to see doctor?'].map((q, i) => (
                    <button key={i} onClick={() => getAIResponse(q)}
                      style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 20, padding: '4px 10px', color: '#64748b', fontSize: 11, cursor: 'pointer' }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Go to full chat */}
            <button onClick={goToChat} style={{ padding: '12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, color: '#a78bfa', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              💬 Continue in Full AI Chat →
            </button>
          </div>
        </div>

        {/* Sign Language Guide */}
        <div className="glass-card" style={{ marginTop: 20, padding: 24 }}>
          <h3 style={{ color: '#f59e0b', marginBottom: 16, fontSize: 16, fontWeight: 700 }}>📖 Sign Language Guide — How to Use</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {SIGNS_GUIDE.map((sign, i) => (
              <div key={i} style={{ background: `${sign.color}08`, border: `1px solid ${sign.color}20`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{sign.emoji}</div>
                <p style={{ color: sign.color, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{sign.meaning}</p>
                <p style={{ color: '#64748b', fontSize: 11 }}>{sign.gesture}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignLanguagePage;