import type { GetMeResponse } from '@/types/users';
import { http, HttpResponse } from 'msw';
import { userDB } from '../db/user.db';
import type { MockUser } from '../types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const userHandlers = [
  // GET /users/me
  // 제네릭: <경로파라미터 없음, 요청바디 없음, 응답바디 타입>
  http.get<never, never, GetMeResponse | { message: string }>(
    `${BASE_URL}/users/me`,
    async ({ request }) => {
      // 헤더에서 토큰 추출(예: "Bearer mock-token-1")
      const authHeader = request.headers.get('Authorization');

      // 토큰 유효성 검사
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(
          { message: '인증 정보가 없거나 올바르지 않습니다.' },
          { status: 401 }
        );
      }

      // 헤더에서 토큰값만 추출
      const requestToken = authHeader.split(' ')[1];

      try {
        // 클라이언트에서 보낸 JWT 디코딩 (base64 부분 찾아서 파싱)
        const payloadBase64 = requestToken.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const decoded = JSON.parse(payloadJson);
        const userId = Number(decoded.sub);

        // 토큰 payload의 sub(유저 ID)를 기반으로 DB에서 유저 찾기
        const user = userDB.find((u: MockUser) => u.id === userId);

        if (!user) {
          return new HttpResponse(
            { message: '해당 유저를 찾을 수 없습니다.' },
            { status: 404 }
          );
        }

        const { password, ...userResponse } = user as MockUser;

        return HttpResponse.json(userResponse as GetMeResponse);
      } catch (_error) {
        return new HttpResponse(
          { message: '유효하지 않은 토큰입니다.' },
          { status: 401 }
        );
      }
    }
  ),
];
