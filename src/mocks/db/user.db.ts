import type { MockUser } from '../types';

// 초기 테스트용 데이터
export const userDB: MockUser[] = [
  {
    id: 1,
    email: 'test@example.com',
    name: '테스트 유저',
    profileImage: 'https://via.placeholder.com/150',
    password: 'password123',
    token: 'mock-token-for-user-1',
  },
  {
    id: 2,
    email: 'jun411@snu.ac.kr',
    name: '이준엽',
    profileImage: undefined,
    password: 'qwer1234!',
    token: 'mock-token-for-user-2',
  },
];
