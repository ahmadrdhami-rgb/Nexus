import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';

const mockUsers = {
  entrepreneur: { id: '1', name: 'Sarah Johnson', email: 'sarah@techwave.io', role: 'entrepreneur' as UserRole },
  investor: { id: '2', name: 'Michael Chen', email: 'michael@vcinnovate.com', role: 'investor' as UserRole },
};

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole, otp?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole, otp?: string) => {
    setIsLoading(true);
    if (
      (role === 'entrepreneur' && email === 'sarah@techwave.io' && password === 'password123' && otp?.length === 6) ||
      (role === 'investor' && email === 'michael@vcinnovate.com' && password === 'password123' && otp?.length === 6)
    ) {
      const mockUser = mockUsers[role];
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials or OTP');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};