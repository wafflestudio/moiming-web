import apiClient from '@/api/apiClient';
import type {
  GetMeResponse,
  PatchMeRequest,
  PatchMeResponse,
} from '@/types/users';

// 나의 정보 조회 (GET /api/users/me)
export async function getMe(token?: string): Promise<GetMeResponse> {
  // token이 인자로 들어오면 헤더에 명시적으로 넣어주고, 없으면 인터셉터가 처리
  const headers = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
  const response = await apiClient.get('/users/me', headers);
  return response.data;
}

// 나의 정보 수정 (PATCH /api/users/me)
export async function patchMe(data: PatchMeRequest): Promise<PatchMeResponse> {
  const response = await apiClient.patch('/users/me', data);
  return response.data;
}

// TODO: 회원 탈퇴 (DELETE /api/users/me)
