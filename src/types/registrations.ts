import type { GuestStatus } from '@/types/schemas';

// ---------- GET /me ----------

export interface MyRegistrationsResponse {
  registrations: MyRegistration[];
}

export interface MyRegistration {
  publicId: string;
  title: string;
  startAt?: string;
  endAt?: string;
  registrationStart: string;
  registrationDeadline: string;
  capacity: number;
  registrationCnt: number;
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELED';
  waitingNum?: number;
}

// ---------- GET /:id ----------

export interface GetRegistrationResponse {
  status: GuestStatus;
  guestName: string;
  waitlistPosition: number;
  registrationPublicId: string;
  reservationEmail: string;
}

// ---------- PATCH /:id ----------

export interface PatchRegistrationRequest {
  status: GuestStatus;
}

export interface PatchRegistrationResponse {
  patchEmail: string;
}
