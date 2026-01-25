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

interface DetailedEvent extends Event {
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
  status: viewerStatus;
  waitlistPosition?: number;
  registrationId?: number;
  reservationEmail: string;
}

interface ViewerCapabilities {
  shareLink: boolean;
  apply: boolean;
  cancel: boolean;
}

interface UserPreview {
  id: number;
  name: string;
  profileImage?: string;
}

type viewerStatus =
  | 'HOST'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'CANCELLED'
  | 'BANNED'
  | 'NONE';

// ---------- PUT /:eventId ----------

export interface UpdateEventRequest extends Event {
  waitlistEnabled: boolean;
}

export interface UpdateEventRequest extends Event {
  waitlistEnabled: boolean;
}

// ---------- GET /me ----------

export interface MyEventsResponse {
  events: MyEvent[];
}

interface MyEvent {
  publicId: EventId;
  title: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  totalApplicants: number;
  registrationStartsAt?: string;
  registrationEndsAt?: string;
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
  status: GuestStatus;
  waitlistPosition?: number;
  confirmEmail: string;
}
