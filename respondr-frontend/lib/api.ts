import axios, { AxiosInstance } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ReportRequest,
  ReportResponse,
  AssignmentAction,
  AssignmentResponse,
  PendingReport,
} from './types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/api/auth/signup', data);
  return response.data;
};

export const createReport = async (data: ReportRequest): Promise<ReportResponse> => {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('latitude', data.latitude.toString());
  formData.append('longitude', data.longitude.toString());
  if (data.description) formData.append('description', data.description);
  if (data.destination) formData.append('destination', data.destination);
  if (data.photo) formData.append('photo', data.photo);

  const response = await api.post<ReportResponse>('/api/report/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const handleAssignment = async (
  assignmentId: number,
  data: AssignmentAction,
): Promise<AssignmentResponse> => {
  const response = await api.post<AssignmentResponse>(`/api/driver/assignment/${assignmentId}`, data);
  return response.data;
};

export const getPendingReports = async (): Promise<PendingReport[]> => {
  const response = await api.get<PendingReport[]>('/api/driver/pending');
  return response.data;
};