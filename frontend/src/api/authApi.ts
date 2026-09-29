import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organization_name: string;
  industry?: string;
  currency?: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  organization_id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  industry: string;
  currency: string;
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', payload);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', payload);
  },

  getMe: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/me');
  },

  getCurrentOrganization: async (): Promise<OrganizationProfile> => {
    return apiClient.get<OrganizationProfile>('/organizations/current');
  },
};
