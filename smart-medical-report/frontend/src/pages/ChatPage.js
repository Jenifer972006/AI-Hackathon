import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaRobot, FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { chatQuery } from '../utils/api';
import LanguageSelector from '../components/LanguageSelector';

const Message = ({ msg }) => {
  const isBot = msg.role === 'bot';
  const handleSpeak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };
  return (
    <div style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: 16, alignItems: 'flex-start' }}>
      {isBot && (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0, marginTop: 4 }}>
          <FaRobot color="white" size={16} />
        </div>
      )}
      <div style={{
        maxWidth: '75%', padding: '14px 18px',
        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        background: isBot ? 'rgba(13,27,42,0.9)' : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,153,204,0.15))',
        border: `1px solid ${isBot ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.3)'}`,
      }}>
        {msg.isSignLanguage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>🤟</span>
            <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>Sign Language Input</span>
          </div>
        )}
        <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ color: '#374151', fontSize: 11 }}>
            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isBot && (
            <button onClick={() => handleSpeak(msg.content)}
              style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaVolumeUp size={11} /> Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FaRobot color="white" size={16} />
    </div>
    <div style={{ background: 'rgba(13,27,42,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '4px 16px 16px 16px', padding: '14px 20px' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', animation: `bounce 1.4s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
    <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-8px);opacity:1} }`}</style>
  </div>
);

const ChatPage = () => {
  const [messages, setMessages] = useState([{
    role: 'bot',
    content: `Hello! 👋 I am your Smart Medical AI Assistant.\n\nI remember our ENTIRE conversation — ask follow-up questions naturally!\n\nExample:\n• You: "I have stomach pain"\n• You: "What drink should I have?" → I know you mean for stomach pain!\n• You: "What about exercise?" → I still remember the context!\n\nYou can also use 🎤 voice or 🤟 sign language. How can I help you?`,
    timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported. Use Chrome browser.'); return; }
    const langMap = { Hindi:'hi-IN', Tamil:'ta-IN', Telugu:'te-IN', Malayalam:'ml-IN', Kannada:'kn-IN', Bengali:'bn-IN', Gujarati:'gu-IN', Marathi:'mr-IN', Punjabi:'pa-IN' };
    const r = new SR();
    r.lang = langMap[language] || 'en-IN';
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); toast.success('Voice captured! Press send.'); };
    r.onerror = () => { setListening(false); toast.error('Voice error. Try again.'); };
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
    toast.info('🎤 Listening...');
  };

  const sendMessage = async (msgText = null, isSignLanguage = false) => {
    const query = (msgText || input).trim();
    if (!query) return;

    const userMsg = { role: 'user', content: query, timestamp: Date.now(), isSignLanguage };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history (exclude the first greeting message)
      const conversationHistory = newMessages.slice(1, -1).map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }));

      const { data } = await chatQuery({ query, language, conversationHistory });
      setMessages(prev => [...prev, { role: 'bot', content: data.answer, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() }]);
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', content: 'Chat cleared! Starting fresh. How can I help you?', timestamp: Date.now() }]);
  };

  const quickStarters = [
    { label: '🤢 Stomach pain', msg: 'I have stomach pain' },
    { label: '🤒 Fever & headache', msg: 'I have fever and headache' },
    { label: '💊 Medicine info', msg: 'What are my medicines for?' },
    { label: '🥗 What to eat', msg: 'What should I eat today for good health?' },
    { label: '😴 Sleep issues', msg: 'I am not able to sleep well at night' },
    { label: '💪 Stay healthy', msg: 'Give me tips to stay healthy' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '20px 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 84px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>🤖 Medical <span className="gradient-text">AI Chat</span></h1>
            <p style={{ color: '#64748b', fontSize: 12 }}>🧠 Remembers full conversation • 🎤 Voice • 🤟 Sign Language</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 155 }}>
              <LanguageSelector value={language} onChange={setLanguage} label="Language" />
            </div>
            <Link to="/sign-language">
              <button style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#f59e0b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                🤟 Sign Language
              </button>
            </Link>
            <button onClick={clearChat} style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FaTrash size={11} /> Clear
            </button>
          </div>
        </div>

        {/* Context memory badge */}
        {messages.length > 2 && (
          <div style={{ padding: '7px 14px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#10b981', fontSize: 13 }}>🧠</span>
            <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>
              AI remembers {messages.length - 1} messages — ask follow-up questions freely without repeating context!
            </span>
          </div>
        )}

        {/* Messages area */}
        <div className="glass-card" style={{ flex: 1, overflowY: 'auto', padding: 20, marginBottom: 10 }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Quick starters */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: '#374151', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Start:</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {quickStarters.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q.msg)}
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 20, padding: '5px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : startVoiceInput}
            title="Voice input"
            style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${listening ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.3)'}`, background: listening ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: listening ? 'pulse 1s infinite' : 'none' }}>
            {listening ? <FaMicrophoneSlash color="#ef4444" size={15} /> : <FaMicrophone color="#00d4ff" size={15} />}
          </button>

          <Link to="/sign-language" title="Sign language">
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>🤟</button>
          </Link>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Ask anything in ${language}... (Enter to send)`}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 14, resize: 'none', minHeight: 40, maxHeight: 120, lineHeight: 1.6, fontFamily: 'inherit', paddingTop: 8 }}
            rows={1}
          />

          <button className="btn-primary" onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ width: 40, height: 40, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaPaperPlane size={14} />
          </button>
        </div>

        <p style={{ color: '#374151', fontSize: 11, textAlign: 'center', marginTop: 5 }}>
          ⚕️ For informational purposes only — always consult a doctor for medical decisions
        </p>
      </div>
    </div>
  );
};

export default ChatPage;