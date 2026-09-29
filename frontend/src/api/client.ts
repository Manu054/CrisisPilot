/**
 * Centralized API Client for CrisisPilot
 * Handles Base URL, Bearer Authentication, JSON parsing, error normalization, and 401 redirects.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('crisispilot_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // If not already on auth pages, remove token and dispatch unauthorized event
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
        if (!isAuthPage) {
          localStorage.removeItem('crisispilot_token');
          localStorage.removeItem('crisispilot_user');
          window.dispatchEvent(new Event('crisispilot_unauthorized'));
        }
      }

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorData: ApiError = {
          status: response.status,
          code: data.error?.code || 'REQUEST_FAILED',
          message: data.error?.message || data.detail || (typeof data === 'string' ? data : 'An unexpected error occurred.'),
          details: data.error?.details || data,
        };
        throw errorData;
      }

      return data as T;
    } catch (error: any) {
      if (error && error.status) {
        throw error;
      }
      throw {
        status: 0,
        code: 'NETWORK_ERROR',
        message: error?.message || 'Unable to connect to CrisisPilot API server. Please check your connection.',
      } as ApiError;
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
