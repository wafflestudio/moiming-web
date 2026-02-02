import apiClient from '@/api/apiClient';
import type { SignUpRequest, SignUpResponse } from '@/types/auth';

export default async function signUp(data: SignUpRequest) {
  const formData = new FormData();

  formData.append('email', data.email);
  formData.append('name', data.name);
  formData.append('password', data.password);

  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  // axios will throw on non-2xx by default.
  // We return the response so the caller can check status if needed (e.g. 201 vs 204).
  return await apiClient.post<SignUpResponse>('/auth/signup', formData);
}
