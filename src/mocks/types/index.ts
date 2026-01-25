import type { User } from '@/types/schemas';

// 기존 User 타입을 확장하여 비밀번호 필드 추가
export interface MockUser extends User {
  password: string;
  token: string;
}
