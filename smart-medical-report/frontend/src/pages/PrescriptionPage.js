import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPrescriptionBottleAlt } from 'react-icons/fa';
import FileUpload from '../components/FileUpload';
import LanguageSelector from '../components/LanguageSelector';
import { analyzePrescription } from '../utils/api';

const PrescriptionPage = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a prescription image first');

    setLoading(true);
    const steps = [
      'Reading your prescription...',
      'Decoding handwritten text with AI...',
      'Analyzing medications...',
      'Generating comprehensive reports...'
    ];

    let step = 0;
    setProgress(steps[0]);
    const interval = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1);
      setProgress(steps[step]);
    }, 2500);

    try {
      const formData = new FormData();
      formData.append('prescription', file);
      formData.append('language', language);

      const { data } = await analyzePrescription(formData);
      clearInterval(interval);

      if (data.success) {
        toast.success('Prescription analyzed successfully!');
        navigate(`/report/${data.reportId}`);
      }
    } catch (error) {
      clearInterval(interval);
      toast.error(error.response?.data?.message || 'Failed to analyze prescription');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 30, padding: '8px 18px', marginBottom: 20 }}>
            <FaPrescriptionBottleAlt color="#a78bfa" size={16} />
            <span style={{ color: '#a78bfa', fontSize: 14, fontWeight: 600 }}>Handwritten Prescription Analysis</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Decode <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Any Prescription</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 550, margin: '0 auto' }}>
            Upload a photo of any handwritten prescription — even the most difficult doctor's handwriting. Our AI reads and analyzes it completely.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📷 UPLOAD PRESCRIPTION PHOTO
            </label>
            <FileUpload
              onFileSelect={setFile}
              label="Upload Handwritten Prescription (JPG, PNG, PDF)"
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'], 'application/pdf': ['.pdf'] }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <LanguageSelector value={language} onChange={setLanguage} label="Output Language" />
          </div>

          {/* Features of prescription analysis */}
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <p style={{ color: '#a78bfa', fontWeight: 700, marginBottom: 12 }}>🔬 What You'll Get</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                'Decoded prescription text', 'Disease/condition analysis',
                'All medications listed', 'Dosage & timing for each medicine',
                'Food interaction guide', 'Before/after food instructions'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                  <span style={{ color: '#10b981' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#a78bfa', fontWeight: 600 }}>{progress}</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Handwriting analysis may take 20-40 seconds...</p>
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: 16, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              onClick={handleAnalyze}
              disabled={!file}
            >
              🔍 Analyze Prescription
            </button>
          )}
        </div>

        <div style={{ marginTop: 20, padding: 16, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12 }}>
          <p style={{ color: '#f59e0b', fontSize: 13, lineHeight: 1.6 }}>
            ⚠️ <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only. Always consult your doctor before making any changes to your medication or treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
