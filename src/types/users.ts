import type { User } from '@/types/schemas';

// ---------- /me ----------

export type GetMeResponse = User;

export interface PatchMeRequest {
  name: string;
  email?: string;
  password?: string;
  profileImage?: string;
}

export type PatchMeResponse = User;
