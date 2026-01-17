import type {
  EventDetailResponse,
  JoinEventRequest,
  JoinEventResponse,
  RegistrationListResponse,
} from '@/types/events';
import apiClient from './apiClient';

// 일정 상세 응답 (GET /api/events/:id)
export const getEventDetail = async (id: string) => {
  const response = await apiClient.get<EventDetailResponse>(`/events/${id}`);
  return {
    data: response.data,
    status: response.status,
  };
};

// 참여자 명단 (GET /api/events/:id/registrations)
export const getRegistrations = async (id: string) => {
  const response = await apiClient.get<RegistrationListResponse>(
    `/events/${id}/registrations`
  );
  return response.data;
};

// 참여 신청 (POST /api/events/:id/registrations)
export const registerEvent = async (id: string, data: JoinEventRequest) => {
  const response = await apiClient.post<JoinEventResponse>(
    `/events/${id}/registrations`,
    data
  );
  return {
    data: response.data,
    status: response.status,
  };
};

// 이벤트 신청 취소(POST /api/v1/events/{eventId}/registrations/{registrationId}/cancel)
// export const cancelRegistration = async (
//   eventId: string,
//   registrationId: number,
//   token: string
// ) => {
//   const response = await apiClient.post(
//     `/events/${eventId}/registrations/${registrationId}/cancel`,
//     null, // body는 비우고 query parameter로 전달
//     { params: { token } }
//   );
//   return response.data;
// };
