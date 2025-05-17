'use client';

import './globals.css';
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken } from '@/lib/api';
import { Toaster } from '@/components/ui/toaster';

interface AuthContextType {
  token: string | null;
  role: 'Public' | 'Responder' | null;
  userId: number | null;
  login: (token: string, role: 'Public' | 'Responder', userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'Public' | 'Responder' | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const payload = jwtDecode<{ user_id: number; role: 'Public' | 'Responder' }>(storedToken);
        setToken(storedToken);
        setRole(payload.role);
        setUserId(payload.user_id);
        setAuthToken(storedToken);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newToken: string, newRole: 'Public' | 'Responder', newUserId: number) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    setAuthToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUserId(null);
    setAuthToken(null);
  };

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthContext.Provider value={{ token, role, userId, login, logout }}>
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthContext.Provider>
      </body>
    </html>
  );
}