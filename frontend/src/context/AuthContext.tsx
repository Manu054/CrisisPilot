import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, UserProfile, OrganizationProfile, LoginPayload, RegisterPayload } from '../api/authApi';

interface AuthContextType {
  user: UserProfile | null;
  organization: OrganizationProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  signup: (userData: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('crisispilot_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [organization, setOrganization] = useState<OrganizationProfile | null>(() => {
    const cached = localStorage.getItem('crisispilot_org');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('crisispilot_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const userProfile = await authApi.getMe();
      setUser(userProfile);
      localStorage.setItem('crisispilot_user', JSON.stringify(userProfile));

      const orgProfile = await authApi.getCurrentOrganization().catch(() => null);
      if (orgProfile) {
        setOrganization(orgProfile);
        localStorage.setItem('crisispilot_org', JSON.stringify(orgProfile));
      }
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const existingToken = localStorage.getItem('crisispilot_token');
      if (existingToken) {
        await fetchProfile();
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for 401 unauthorized events from API client
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('crisispilot_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('crisispilot_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('crisispilot_token', response.access_token);
      setToken(response.access_token);

      const userProfile: UserProfile = {
        id: response.user_id,
        organization_id: response.organization_id,
        name: response.name,
        email: response.email,
        role: response.role,
      };
      setUser(userProfile);
      localStorage.setItem('crisispilot_user', JSON.stringify(userProfile));

      const orgProfile = await authApi.getCurrentOrganization().catch(() => null);
      if (orgProfile) {
        setOrganization(orgProfile);
        localStorage.setItem('crisispilot_org', JSON.stringify(orgProfile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      localStorage.setItem('crisispilot_token', response.access_token);
      setToken(response.access_token);

      const userProfile: UserProfile = {
        id: response.user_id,
        organization_id: response.organization_id,
        name: response.name,
        email: response.email,
        role: response.role,
      };
      setUser(userProfile);
      localStorage.setItem('crisispilot_user', JSON.stringify(userProfile));

      const orgProfile = await authApi.getCurrentOrganization().catch(() => null);
      if (orgProfile) {
        setOrganization(orgProfile);
        localStorage.setItem('crisispilot_org', JSON.stringify(orgProfile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('crisispilot_token');
    localStorage.removeItem('crisispilot_user');
    localStorage.removeItem('crisispilot_org');
    setToken(null);
    setUser(null);
    setOrganization(null);
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
