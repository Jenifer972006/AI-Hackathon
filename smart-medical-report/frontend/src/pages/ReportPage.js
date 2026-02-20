import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeartbeat, FaPills, FaGlobe, FaVolumeUp, FaVolumeMute, FaDownload } from 'react-icons/fa';
import { getReport, translateReport } from '../utils/api';
import LanguageSelector from '../components/LanguageSelector';

const Section = ({ icon, title, content, color = '#00d4ff' }) => (
  <div className="report-section" style={{ borderLeftColor: color }}>
    <h3 style={{ color, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 15 }}>
      {icon} {title}
    </h3>
    <p style={{ color: '#cbd5e1', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{content}</p>
  </div>
);

const MedCard = ({ med }) => (
  <div className="med-card">
    <h4>💊 {med.name}</h4>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[
        { label: '🎯 Why Prescribed', value: med.whyGiven },
        { label: '✨ Benefits', value: med.benefits },
        { label: '📏 Dosage', value: med.dosage },
        { label: '⏰ Timing', value: med.timing },
        { label: '🍽️ Before/After Food', value: med.beforeOrAfterFood },
      ].map((item, i) => (
        <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 12, gridColumn: i === 4 ? '1 / -1' : '' }}>
          <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{item.label}</p>
          <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>{item.value || 'Not specified'}</p>
        </div>
      ))}
    </div>
  </div>
);

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('report1');
  const [translateLang, setTranslateLang] = useState('Hindi');
  const [translating, setTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await getReport(id);
        if (data.success) setReport(data.report);
      } catch (err) {
        toast.error('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
    return () => { if (speechRef.current) window.speechSynthesis.cancel(); };
  }, [id]);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const { data } = await translateReport(id, translateLang);
      if (data.success) {
        setTranslatedData(data);
        toast.success(`Translated to ${translateLang}!`);
      }
    } catch (err) {
      toast.error('Translation failed. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getReport1Text = () => {
    if (!report?.diseaseAnalysis) return '';
    const d = report.diseaseAnalysis;
    return `Disease Analysis Report. 
Diagnosed Conditions: ${d.diagnosedConditions?.join(', ')}. 
Causes: ${d.causes}. 
Early Symptoms: ${d.earlySymptoms}. 
Future Symptoms: ${d.futureSymptoms}. 
Prevention: ${d.prevention}. 
What To Eat: ${d.whatToEat}. 
What To Avoid: ${d.whatToAvoid}. 
How To Cure: ${d.howToCure}. 
Healthy Lifestyle: ${d.healthyLifestyle}.`;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: '#00d4ff' }}>Loading your reports...</p>
    </div>
  );

  if (!report) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: '#94a3b8', fontSize: 18 }}>Report not found</p>
    </div>
  );

  const da = report.diseaseAnalysis || {};
  const ma = report.medicationAnalysis || {};

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span className="tag tag-green">✓ Analysis Complete</span>
            <span className="tag tag-blue">{report.reportType === 'handwritten' ? 'Handwritten Prescription' : 'Digital Report'}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Your Medical <span className="gradient-text">Analysis Reports</span>
          </h1>
          <p style={{ color: '#94a3b8' }}>File: {report.originalFileName} • Language: {report.language}</p>

          {da.diagnosedConditions?.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {da.diagnosedConditions.map((c, i) => (
                <span key={i} className="tag" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: 13 }}>🏥 {c}</span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'report1', label: '📋 Disease Analysis', icon: <FaHeartbeat /> },
            { id: 'report2', label: '💊 Medication Guide', icon: <FaPills /> },
            { id: 'translate', label: '🌐 Translate', icon: <FaGlobe /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#94a3b8'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report 1 - Disease Analysis */}
        {activeTab === 'report1' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>📋 Report 1: Disease & Condition Analysis</h2>
              <button
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={() => handleSpeak(getReport1Text())}
              >
                {isSpeaking ? <><FaVolumeMute /> Stop</> : <><FaVolumeUp /> Read Aloud</>}
              </button>
            </div>

            <div className="glass-card" style={{ padding: 28 }}>
              <Section icon="🔍" title="Causes" content={da.causes || 'Not available'} color="#00d4ff" />
              <Section icon="⚠️" title="Early Symptoms" content={da.earlySymptoms || 'Not available'} color="#f59e0b" />
              <Section icon="📈" title="Disease Stages" content={da.stages || 'Not available'} color="#a78bfa" />
              <Section icon="🔮" title="Future Symptoms if Untreated" content={da.futureSymptoms || 'Not available'} color="#ef4444" />
              <Section icon="🛡️" title="Prevention & How to Avoid Worsening" content={da.prevention || 'Not available'} color="#10b981" />
              <Section icon="🥗" title="What to Eat (Recommended Foods)" content={da.whatToEat || 'Not available'} color="#10b981" />
              <Section icon="🚫" title="What to Avoid (Foods & Habits)" content={da.whatToAvoid || 'Not available'} color="#ef4444" />
              <Section icon="💊" title="How to Cure / Treatment Approach" content={da.howToCure || 'Not available'} color="#00d4ff" />
              <Section icon="🌟" title="Healthy Lifestyle Recommendations" content={da.healthyLifestyle || 'Not available'} color="#f59e0b" />
            </div>
          </div>
        )}

        {/* Report 2 - Medication Analysis */}
        {activeTab === 'report2' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>💊 Report 2: Medication Guide</h2>
            {ma.medications?.length > 0 ? (
              <div>
                <p style={{ color: '#94a3b8', marginBottom: 20 }}>
                  {ma.medications.length} medication{ma.medications.length > 1 ? 's' : ''} found in your report
                </p>
                {ma.medications.map((med, i) => <MedCard key={i} med={med} />)}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: 16 }}>No medications found in this report</p>
              </div>
            )}
          </div>
        )}

        {/* Translation */}
        {activeTab === 'translate' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>🌐 Translate Reports</h2>
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <LanguageSelector value={translateLang} onChange={setTranslateLang} label="Translate To" />
                </div>
                <button className="btn-primary" onClick={handleTranslate} disabled={translating} style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                  {translating ? 'Translating...' : `Translate to ${translateLang}`}
                </button>
              </div>
            </div>

            {translating && (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#00d4ff' }}>Translating your reports to {translateLang}...</p>
              </div>
            )}

            {translatedData && (
              <div>
                <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                  <h3 style={{ color: '#00d4ff', marginBottom: 16 }}>📋 Report 1 in {translateLang}</h3>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 20 }}>
                    <p style={{ color: '#e2e8f0', lineHeight: 1.8, whiteSpace: 'pre-wrap', direction: ['Urdu', 'Sindhi', 'Arabic'].includes(translateLang) ? 'rtl' : 'ltr' }}>
                      {translatedData.translatedReport1}
                    </p>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ marginTop: 12, padding: '8px 16px', fontSize: 13 }}
                    onClick={() => handleSpeak(translatedData.translatedReport1)}
                  >
                    <FaVolumeUp style={{ marginRight: 6 }} /> Read Aloud
                  </button>
                </div>
                <div className="glass-card" style={{ padding: 28 }}>
                  <h3 style={{ color: '#a78bfa', marginBottom: 16 }}>💊 Report 2 in {translateLang}</h3>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 20 }}>
                    <p style={{ color: '#e2e8f0', lineHeight: 1.8, whiteSpace: 'pre-wrap', direction: ['Urdu', 'Sindhi'].includes(translateLang) ? 'rtl' : 'ltr' }}>
                      {translatedData.translatedReport2}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
