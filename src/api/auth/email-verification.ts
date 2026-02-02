import apiClient from '@/api/apiClient';

export default async function verifyEmail(verificationCode: string) {
  const response = await apiClient.post(
    `/auth/email-verification/${verificationCode}`,
    {}
  );

  return response.data;
}
