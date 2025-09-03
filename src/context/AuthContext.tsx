import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import { users } from '../data/users';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored user on mount and recheck after state changes
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Sync user state with localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      console.log('User set in localStorage:', user);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Mock login function
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundUser = users.find(u => u.email === email && u.role === role);
      
      if (foundUser) {
        setUser(foundUser);
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid credentials or user not found');
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: `${role[0]}${users.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: '',
        isOnline: true,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('No account found with this email');
      }
      
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error('Invalid or expired reset token');
      }
      
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      if (user?.id === userId) {
        setUser(updatedUser);
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};