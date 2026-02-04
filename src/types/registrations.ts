import type { Event, EventId, GuestStatus } from '@/types/schemas';

// ---------- GET /me ----------

export interface MyRegistrationsResponse {
  registrations: MyRegistration[];
}

interface MyRegistration extends Event {
  publicId: EventId;
  totalApplicants: number;
  status: GuestStatus;
  waitlistPosition?: number;
}

// ---------- GET /:id ----------

export interface GetRegistrationResponse {
  status: GuestStatus;
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
