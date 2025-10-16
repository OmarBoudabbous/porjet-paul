import apiClient from './axios';
import { AuthTokens, User } from '../types';

export const authAPI = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await apiClient.post('/users/login/', {
      email,
      password,
    });
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    affiliation: string;
    country: string;
    phone: string;
  }): Promise<User> {
    const response = await apiClient.post('/users/register/', userData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/users/profile/');
    return response.data;
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await apiClient.post('/users/token/refresh/', {
      refresh,
    });
    return response.data;
  },
};