import type { GuestStatus } from '@/types/schemas';

// ---------- GET /me ----------

export interface MyRegistrationsResponse {
  registrations: MyRegistration[];
}

export interface MyRegistration {
  publicId: string;
  title: string;
  startsAt?: string;
  endsAt?: string;
  registrationStartsAt: string;
  registrationEndsAt: string;
  capacity: number;
  confirmedCount: number;
  waitlistCount: number;
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELED';
  waitlistedNum?: number;
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
