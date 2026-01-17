import type { Event, Guest } from '@/types/schemas';

// 일정 상세 응답 (GET /api/events/:id)
export type EventDetailResponse = Event;

// 참여자 명단 (GET /api/events/:id/registrations)
export type RegistrationListResponse = Guest[];

// 참여 신청 (POST /api/events/:id/registrations)
export interface JoinEventRequest {
  guestName: string | null;
  guestEmail: string | null;
}

export interface JoinEventResponse {
  registration: Guest;
  cancelToken: string; // 신청 취소용 토큰
}
