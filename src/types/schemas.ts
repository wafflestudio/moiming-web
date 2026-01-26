export type UserId = number;
export type EventId = string;
type RegistrationId = string;

export type GuestStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELED' | 'BANNED';

export interface User {
  id: UserId;
  email: string;
  name: string;
  profileImage?: string;
}

export interface Event {
  title: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  registrationStartsAt?: string;
  registrationEndsAt?: string;
}

export interface Guest {
  registrationId: RegistrationId;
  name: string;
  email?: string;
  profileImage?: string;
  createdAt: string;
  status: GuestStatus;
  waitlistPosition?: number;
}
