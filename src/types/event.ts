export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startAt: number; // epoch milliseconds
  endAt: number; // epoch milliseconds
  capacity: number;
  waitlistEnabled: boolean;
  registrationDeadline: number; // epoch milliseconds
  createdBy: number; // 작성자 ID
  createdAt?: number;
  updatedAt?: number;
}

export interface Guest {
  id: number;
  userId: number | null; // 회원인 경우 ID, 비회원이면 null
  eventId: number;
  guestName: string | null; // 비회원 이름
  guestEmail: string | null; // 비회원 이메일
  status: 'CONFIRMED' | 'WAITING' | 'CANCELED';
  createdAt: number; // 신청 일시
}

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
