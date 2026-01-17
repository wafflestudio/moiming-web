import type { AuthResponse, LoginRequest } from '../../types/auth';
import apiClient from '../apiClient';

export default async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}
