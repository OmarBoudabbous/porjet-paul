import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens } from '../types';
import { authAPI } from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    affiliation: string;
    country: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** 🔑 Login function */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("[AuthContext] Attempting login with email:", email);
      const tokens: AuthTokens = await authAPI.login(email, password);

      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);

      console.log("[AuthContext] Login successful, tokens stored");

      const userData = await authAPI.getProfile();
      console.log("[AuthContext] User profile loaded:", userData);

      setUser(userData);
    } catch (error: any) {
      if (error.response) {
        console.error('[AuthContext] Login backend error:', error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.error('[AuthContext] Login network/other error:', error.message);
        throw new Error(error.message);
      }
    }
  };

  /** 🔑 Register function */
  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    affiliation: string;
    country: string;
    phone: string;
  }): Promise<void> => {
    try {
      console.log("[AuthContext] Attempting registration with:", userData);

      await authAPI.register(userData);

      console.log("[AuthContext] Registration successful, logging in automatically");

      await login(userData.email, userData.password);
    } catch (error: any) {
      if (error.response) {
        console.error('[AuthContext] Registration backend error:', error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.error('[AuthContext] Registration network/other error:', error.message);
        throw new Error(error.message);
      }
    }
  };

  /** 🔑 Logout */
  const logout = () => {
    console.log("[AuthContext] Logging out and clearing tokens");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  /** 🔑 Refresh profile */
  const refreshProfile = async (): Promise<void> => {
    try {
      console.log("[AuthContext] Refreshing user profile");
      const userData = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("[AuthContext] Profile refresh error, logging out:", error);
      logout();
    }
  };

  // 🔑 Check for existing token on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log("[AuthContext] Initializing auth, token found?", !!token);

      if (token) {
        try {
          await refreshProfile();
        } catch (error) {
          console.error("[AuthContext] Auth initialization failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};