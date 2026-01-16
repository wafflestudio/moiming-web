import apiClient from '@/api/apiClient';
import type { SignUpRequest, SignUpResponse } from '@/types/auth';

export default async function signup(
  data: SignUpRequest
): Promise<SignUpResponse> {
  const formData = new FormData();

  formData.append('email', data.email);
  formData.append('name', data.name);
  formData.append('password', data.password);

  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  const response = await apiClient.post<SignUpResponse>(
    '/auth/signup',
    formData
  );

  return response.data;
}
