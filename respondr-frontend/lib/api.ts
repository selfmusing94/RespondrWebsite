import axios, { AxiosInstance } from 'axios';
import { PendingReport } from '@/lib/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

interface AuthResponse {
  token: string;
  userId: number;
  role: string;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  console.log('Calling login API:', data);
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  console.log('Calling signup API:', data);
  const response = await api.post<AuthResponse>('/api/auth/signup', data);
  return response.data;
};

export const getPendingReports = async (): Promise<PendingReport[]> => {
  const response = await api.get('/api/reports/pending');
  return response.data;
};

export const handleAssignment = async (assignmentId: number, action: { action: 'accept' | 'cancel' }) => {
  const response = await api.post(`/api/assignments/${assignmentId}`, action);
  return response.data;
};

export default api;