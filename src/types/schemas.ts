export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  startAt?: number; // epoch milliseconds
  endAt?: number; // epoch milliseconds
  capacity?: number;
  waitlistEnabled: boolean;
  registrationDeadline?: number; // epoch milliseconds
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
