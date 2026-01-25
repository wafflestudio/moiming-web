import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types/auth';
import { http, HttpResponse, delay } from 'msw';
import { userDB } from '../db/user.db';
import type { MockUser } from '../types';
import { path } from '../utils';

export const authHandlers = [
  // 1. 로그인
  http.post<never, LoginRequest, LoginResponse | { message: string }>(
    path('/auth/login'),
    async ({ request }) => {
      const { email, password } = await request.json();

      // 유저 확인 로직 (간단히 구현)
      const user = userDB.find(
        (u: MockUser) => u.email === email && u.password === password
      );

      if (user) {
        await delay(500); // 실제 서버처럼 약간의 지연 시간 추가
        return HttpResponse.json({
          token: user.token,
        });
      }

      return new HttpResponse(null, {
        status: 401,
        statusText: 'Unauthorized',
      });
    }
  ),

  // 2. 회원가입
  http.post<never, SignUpRequest, SignUpResponse>(
    path('/auth/signup'),
    async ({ request }) => {
      const newUser = await request.json();

      const user: SignUpResponse = {
        id: Date.now(),
        ...newUser,
      };

      const mockUser: MockUser = {
        ...user,
        password: newUser.password,
        token: `mock-token-for-user-${user.id}`,
      };

      userDB.push(mockUser); // DB에 새 유저 추가
      return HttpResponse.json(user, { status: 201 });
    }
  ),

  // 3. 로그아웃
  http.post<never, never, LogoutResponse>(path('/auth/logout'), () => {
    return HttpResponse.json({ message: 'Successfully logged out' });
  }),
];
