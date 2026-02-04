import type {
  Event,
  EventId,
  Guest,
  GuestStatus,
  UserId,
} from '@/types/schemas';

// ---------- POST ----------

export interface CreateEventRequest extends Event {
  description?: string;
  waitlistEnabled: boolean;
  createdBy: UserId;
}

// ---------- GET /:id ----------

export interface EventDetailResponse {
  event: DetailedEvent;
  creator: Creator;
  viewer: Viewer;
  capabilities: ViewerCapabilities;
  guestsPreview: UserPreview[];
}

export interface DetailedEvent extends Event {
  publicId: EventId;
  description?: string;
  totalApplicants: number;
}

interface Creator {
  name: string;
  email: string;
  profileImage?: string;
}

interface Viewer {
  status: ViewerStatus;
  waitlistPosition?: number;
  registrationPublicId?: string;
  reservationEmail: string;
}

interface ViewerCapabilities {
  shareLink: boolean;
  apply: boolean;
  wait: boolean;
  cancel: boolean;
}

export interface UserPreview {
  id: number;
  name: string;
  profileImage?: string;
}

type ViewerStatus =
  | 'HOST'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'CANCELED'
  | 'BANNED'
  | 'NONE';

// ---------- PUT /:id ----------

export interface UpdateEventRequest extends Event {
  waitlistEnabled: boolean;
}

export interface UpdateEventResponse extends Event {
  waitlistEnabled: boolean;
}

// ---------- GET /me ----------

export interface MyEventsResponse {
  events: MyEvent[];
}

export interface MyEvent {
  publicId: EventId;
  title: string;
  startsAt?: string;
  endsAt?: string;
  capacity: number;
  totalApplicants: number;
  registrationStartsAt: string;
  registrationEndsAt: string;
}

// ---------- GET /:id/registrations ----------

export interface GuestsParams {
  status?: GuestStatus;
  orderBy?: 'name' | 'registeredAt';
  cursor?: string;
}

export interface GuestsResponse {
  participants: Guest[];
  nextCursor: string;
  hasNext: boolean;
}

// ---------- POST /:id/registrations ----------

export interface JoinEventRequest {
  guestName?: string;
  guestEmail?: string;
}

export interface JoinEventResponse {
  registrationPublicId: string;
}

export type EventViewType =
  | 'ADMIN' // 관리자 (공유/수정 권한)
  | 'APPLY' // 신청 가능 (정원 여유)
  | 'WAITLIST' // 대기 신청 가능 (정원 초과)
  | 'CONFIRMED' // 참여 확정 상태
  | 'WAITLISTED' // 대기 번호를 받은 상태
  | 'BANNED' // 차단된 사용자
  | 'UPCOMING' // 모집 예정
  | 'ENDED' // 모집 종료
  | 'CLOSED'; // 모집 마감
