import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFileAlt, FaPrescriptionBottleAlt, FaTrash, FaEye, FaDatabase, FaCalendar } from 'react-icons/fa';
import { getUserReports } from '../utils/api';
import API from '../utils/api';

const ReportsHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const { data } = await getUserReports();
      if (data.success) setReports(data.reports);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      await API.delete(`/reports/${reportId}`);
      setReports(prev => prev.filter(r => r._id !== reportId));
      toast.success('Report deleted successfully');
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: '#00d4ff' }}>Loading your saved reports...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 30, padding: '6px 14px', marginBottom: 12 }}>
              <FaDatabase color="#00d4ff" size={13} />
              <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>Stored in MongoDB Database</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
              My <span className="gradient-text">Report History</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              All analyzed reports saved permanently — {reports.length} report{reports.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/analyze"><button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>+ New Report</button></Link>
            <Link to="/prescription"><button className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14 }}>+ Prescription</button></Link>
          </div>
        </div>

        {/* Stats */}
        {reports.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Reports', value: reports.length, color: '#00d4ff', icon: '📋' },
              { label: 'Digital Reports', value: reports.filter(r => r.reportType === 'digital').length, color: '#10b981', icon: '📄' },
              { label: 'Prescriptions', value: reports.filter(r => r.reportType === 'handwritten').length, color: '#a78bfa', icon: '💊' },
              { label: 'Completed', value: reports.filter(r => r.status === 'completed').length, color: '#f59e0b', icon: '✅' },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {reports.length === 0 && (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>No Reports Saved Yet</h2>
            <p style={{ color: '#94a3b8', marginBottom: 24 }}>Upload your first medical report — it will be saved here automatically</p>
            <Link to="/analyze"><button className="btn-primary" style={{ padding: '12px 28px' }}>Analyze My First Report →</button></Link>
          </div>
        )}

        {/* Reports list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map((report) => (
            <div key={report._id} className="glass-card" style={{ padding: 22, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

                {/* Icon + Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: report.reportType === 'handwritten' ? 'rgba(124,58,237,0.15)' : 'rgba(0,212,255,0.12)' }}>
                    {report.reportType === 'handwritten'
                      ? <FaPrescriptionBottleAlt color="#a78bfa" size={20} />
                      : <FaFileAlt color="#00d4ff" size={20} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* File name + badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>
                        {report.originalFileName || 'Medical Report'}
                      </span>
                      <span className={`tag ${report.reportType === 'handwritten' ? 'tag-purple' : 'tag-blue'}`} style={{ fontSize: 11 }}>
                        {report.reportType === 'handwritten' ? '✍️ Handwritten' : '📄 Digital'}
                      </span>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                        background: report.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: report.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                        {report.status === 'completed' ? '✓ Complete' : '⏳ ' + report.status}
                      </span>
                    </div>

                    {/* Conditions */}
                    {report.diseaseAnalysis?.diagnosedConditions?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                        {report.diseaseAnalysis.diagnosedConditions.slice(0, 3).map((c, i) => (
                          <span key={i} style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>
                            🏥 {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748b', fontSize: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaCalendar size={10} /> {formatDate(report.createdAt)}
                      </span>
                      {report.language && report.language !== 'English' && (
                        <span>🌐 {report.language}</span>
                      )}
                      {report.medicationAnalysis?.medications?.length > 0 && (
                        <span style={{ color: '#a78bfa' }}>
                          💊 {report.medicationAnalysis.medications.length} medicine{report.medicationAnalysis.medications.length > 1 ? 's' : ''}
                        </span>
                      )}
                      <span style={{ color: '#374151' }}>
                        🗂️ {report.fileType?.replace('.', '').toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link to={`/report/${report._id}`}>
                    <button style={{ padding: '8px 16px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 8, color: '#00d4ff', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FaEye size={12} /> View Report
                    </button>
                  </Link>
                  <button onClick={() => deleteReport(report._id)}
                    style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaTrash size={11} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsHistoryPage;