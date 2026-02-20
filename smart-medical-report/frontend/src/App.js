import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import PrescriptionPage from './pages/PrescriptionPage';
import ReportPage from './pages/ReportPage';
import ReportsHistoryPage from './pages/ReportsHistoryPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccessibilityPage from './pages/AccessibilityPage';
import SignLanguagePage from './pages/SignLanguagePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          theme="dark"
          toastStyle={{ background: '#0d1b2a', border: '1px solid rgba(0,212,255,0.2)' }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/history" element={<ReportsHistoryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/sign-language" element={<SignLanguagePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;