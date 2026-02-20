import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBrain, FaUpload, FaCog } from 'react-icons/fa';
import FileUpload from '../components/FileUpload';
import LanguageSelector from '../components/LanguageSelector';
import { analyzeReport } from '../utils/api';

const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a medical report file first');

    setLoading(true);
    const steps = [
      'Uploading your report securely...',
      'Extracting medical data...',
      'Running AI disease analysis...',
      'Analyzing medications...',
      'Generating your personalized reports...'
    ];

    let step = 0;
    setProgress(steps[0]);
    const interval = setInterval(() => {
      step = (step + 1) % steps.length;
      setProgress(steps[step]);
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('report', file);
      formData.append('language', language);
      formData.append('reportType', 'digital');

      const { data } = await analyzeReport(formData);
      clearInterval(interval);

      if (data.success) {
        toast.success('Analysis complete! Opening your reports...');
        navigate(`/report/${data.reportId}`);
      }
    } catch (error) {
      clearInterval(interval);
      const msg = error.response?.data?.message || 'Analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 30, padding: '8px 18px', marginBottom: 20 }}>
            <FaBrain color="#00d4ff" size={16} />
            <span style={{ color: '#00d4ff', fontSize: 14, fontWeight: 600 }}>Digital Report Analysis</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Analyze Your <span className="gradient-text">Medical Report</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Upload any medical report — PDF or image. Our AI will generate two comprehensive, easy-to-understand reports.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          {/* File Upload */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📄 UPLOAD YOUR REPORT
            </label>
            <FileUpload onFileSelect={setFile} label="Upload Medical Report (PDF, JPG, PNG, etc.)" />
          </div>

          {/* Language */}
          <div style={{ marginBottom: 32 }}>
            <LanguageSelector value={language} onChange={setLanguage} label="Report Output Language" />
          </div>

          {/* Info boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10, padding: 16 }}>
              <p style={{ color: '#00d4ff', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>📋 Report 1 — Disease Analysis</p>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>Causes, symptoms, stages, future symptoms, food guide, prevention & lifestyle tips</p>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, padding: 16 }}>
              <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>💊 Report 2 — Medication Guide</p>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>All medicines analyzed with dosage, timing (morning/night), before/after food details</p>
            </div>
          </div>

          {/* Analyze button */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
                <div className="spinner" />
                <FaCog color="#00d4ff" size={20} style={{ animation: 'spin 2s linear infinite' }} />
              </div>
              <p style={{ color: '#00d4ff', fontWeight: 600 }}>{progress}</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>This may take 15-30 seconds...</p>
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onClick={handleAnalyze}
              disabled={!file}
            >
              <FaUpload size={16} />
              Generate AI Medical Reports
            </button>
          )}
        </div>

        {/* Tips */}
        <div style={{ marginTop: 24, padding: 20, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12 }}>
          <p style={{ color: '#10b981', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>💡 Tips for Best Results</p>
          <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, paddingLeft: 20 }}>
            <li>Ensure the report image is clear and well-lit</li>
            <li>PDF files from hospitals work best</li>
            <li>Both digital and scanned reports are supported</li>
            <li>All personal information is processed securely and not stored permanently</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
