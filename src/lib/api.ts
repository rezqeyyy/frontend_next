import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

export const getDashboardSummary = async () => {
  const response = await api.get('/api/dashboard-summary');
  return response.data;
};

export const predictCustomer = async (data: any) => {
  const response = await api.post('/api/predict', data);
  return response.data;
};

// Tambahkan ini di src/lib/api.ts
export const loginUser = async (credentials: any) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export default api;