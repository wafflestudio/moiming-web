import apiClient from '@/api/apiClient';
import type {
  GetRegistrationResponse,
  PatchRegistrationRequest,
  PatchRegistrationResponse,
} from '@/types/registrations';

// 신청 상세 조회 (GET /api/registrations/:id)
export async function getRegistrationDetail(
  registrationPublicId: string
): Promise<GetRegistrationResponse> {
  const response = await apiClient.get(
    `/registrations/${registrationPublicId}`
  );
  return response.data;
}

// 신청 상태 수정 (PATCH /api/registrations/:id)
export async function patchRegistration(
  id: string,
  data: PatchRegistrationRequest
): Promise<PatchRegistrationResponse> {
  const response = await apiClient.patch(`/registrations/${id}`, data);
  return response.data;
}
