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

// lib/api.ts
export async function createReport(data: {
  type: 'SOS' | 'Booking';
  latitude: number;
  longitude: number;
  description?: string;
  photo: File;
}) {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('latitude', String(data.latitude));
  formData.append('longitude', String(data.longitude));
  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('photo', data.photo);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')!}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to send report');
  }

  return await res.json();
}


export default api;