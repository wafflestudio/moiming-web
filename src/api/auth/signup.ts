import type { AuthResponse, SignUpRequest } from '../../types/auth';
import apiClient from '../apiClient';

export default async function signup(
  data: SignUpRequest
): Promise<AuthResponse> {
  const formData = new FormData();

  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('name', data.name);

  if (data.photo) {
    formData.append('photo', data.photo); // 백엔드 필드명과 'photo' 일치시키기
  }

  const response = await apiClient.post<AuthResponse>('/auth/signup', formData);
  return response.data;
}
