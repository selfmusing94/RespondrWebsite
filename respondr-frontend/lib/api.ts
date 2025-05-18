import axios, { AxiosInstance } from 'axios';
import { PendingReport } from '@/lib/types';

const API_BASE_URL = 'http://localhost:3001/api';

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
  const response = await api.get('/api/driver/pending');
  return response.data;
};

export const handleAssignment = async (assignmentId: number, action: { action: 'accept' | 'cancel' }) => {
  const response = await api.post(`/api/driver/assignment/${assignmentId}`, action);
  return response.data;
};

export async function createReport(data: {
  type: string;
  latitude: number;
  longitude: number;
  description?: string;
  photo: File;
}) {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('latitude', data.latitude.toString());
  formData.append('longitude', data.longitude.toString());
  if (data.description) formData.append('description', data.description);
  formData.append('photo', data.photo);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Failed to create report');
  }

  return response.json();
}



export default api;