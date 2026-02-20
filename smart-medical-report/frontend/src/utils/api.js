import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('medai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const analyzeReport = (formData) => API.post('/reports/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const analyzePrescription = (formData) => API.post('/prescription/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const translateReport = (reportId, targetLanguage) =>
  API.post(`/reports/translate/${reportId}`, { targetLanguage });

export const getReport = (reportId) => API.get(`/reports/${reportId}`);
export const getUserReports = () => API.get('/reports');

export const chatQuery = (data) => API.post('/chat/query', data);

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

export default API;
