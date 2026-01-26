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

// ---------- PATCH /:id ----------

export interface PatchRegistrationRequest {
  status: GuestStatus;
}

export interface PatchRegistrationResponse {}
