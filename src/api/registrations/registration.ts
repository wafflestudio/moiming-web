import apiClient from '@/api/apiClient';
import type {
  PatchRegistrationRequest,
  PatchRegistrationResponse,
} from '@/types/registrations';

// 신청 상태 수정 (PATCH /api/registrations/:id)
export default async function patchRegistration(
  id: string,
  data: PatchRegistrationRequest
): Promise<PatchRegistrationResponse> {
  const response = await apiClient.patch(`/registrations/${id}`, data);
  return response.data;
}
