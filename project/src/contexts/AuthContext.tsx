import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

const API_URL = 'http://localhost:8080/api';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password:string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  sessionInfo: { createdAt: number; lastActivity: number; sessionId: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<{ createdAt: number; lastActivity: number; sessionId: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.userId, username: payload.username, role: payload.role });
          setSessionInfo({ createdAt: payload.iat * 1000, lastActivity: Date.now(), sessionId: payload.jti || '' });
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Failed to parse auth token:", error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Username or password incorrect' };
      }
      localStorage.setItem('authToken', data.token);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({ id: payload.userId, username: payload.username, role: payload.role });
      setSessionInfo({ createdAt: payload.iat * 1000, lastActivity: Date.now(), sessionId: payload.jti || '' });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to connect to the backend server.' };
    }
  };

  const logout = () => {
    setUser(null);
    setSessionInfo(null);
    localStorage.removeItem('authToken');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return { success: false, error: 'User not authenticated.' };
    }

    try {
        const response = await fetch(`${API_URL}/user/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Failed to change password.' };
        }

        return { success: true };

    } catch (error) {
        console.error("Error changing password:", error);
        return { success: false, error: 'A network error occurred.' };
    }
  };


  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading, changePassword, sessionInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
