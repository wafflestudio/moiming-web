import type { EventDetailResponse, GuestsResponse } from '@/types/events';
// src/mocks/handlers/event.ts
import { http, HttpResponse, delay } from 'msw';
import { path } from '../utils';

export const eventHandlers = [
  // 1. 일정 상세 정보 조회 (GET /events/:id)
  http.get(path('/events/:id'), async ({ params }) => {
    const { id } = params;
    await delay(300);

    // EventDetailResponse 타입에 맞춘 모킹 데이터
    return HttpResponse.json<EventDetailResponse>({
      event: {
        publicId: id as string,
        title: '모이샤 정기모임',
        description: '2월 2일 모이샤 정기모임을 가집니다!',
        totalApplicants: 15,
        // DetailedEvent는 Event를 상속받으므로 필요한 기본 필드들(장소, 시간 등)이 포함되어야 합니다.
        location: '서울대 잔디광장',
        startsAt: '2026-02-15T14:00:00Z',
        endsAt: '2026-02-15T15:00:00Z',
        registrationStartsAt: '2026-02-07T07:00:00Z',
        registrationEndsAt: '2026-02-10T23:00:00Z',
        capacity: 60,
      },
      creator: {
        name: '홍지수',
        email: 'hongjisu@gmail.com',
        profileImage: 'https://github.com/shadcn.png',
      },
      viewer: {
        status: 'HOST', // 'HOST', 'CONFIRMED', 'WAITLISTED', 'CANCELED', 'BANNED', 'NONE' 중 선택
        name: '모이샤 회원',
        waitlistPosition: 0,
        registrationPublicId: 'reg-sample-123',
        reservationEmail: 'moisha@weee.com',
      },
      capabilities: {
        shareLink: true,
        apply: true,
        wait: false,
        cancel: false,
      },
      guestsPreview: [
        {
          id: 1,
          name: '김철수',
          profileImage: 'https://github.com/shadcn.png',
        },
        { id: 2, name: '안영희', profileImage: '' },
        {
          id: 3,
          name: '홍길동',
          profileImage: 'https://github.com/shadcn.png',
        },
        {
          id: 4,
          name: '홍길동',
          profileImage: 'https://github.com/shadcn.png',
        },
        {
          id: 5,
          name: '홍길동',
          profileImage: 'https://github.com/shadcn.png',
        },
      ],
    });
  }),

  // 2. 참여자 전체 명단 조회 (GET /events/:id/registrations)
  http.get(path('/events/:id/registrations'), async () => {
    await delay(200);

    return HttpResponse.json<GuestsResponse>({
      participants: Array.from({ length: 10 }).map((_, i) => ({
        publicId: `guest-${i}`,
        registrationId: `reg-id-${i}`,
        name: `참여자 ${i + 1}`,
        email: i < 8 ? `user${i}@example.com` : null,
        status: i < 8 ? 'CONFIRMED' : 'WAITLISTED',
        profileImage: 'https://github.com/shadcn.png',
        createdAt: new Date().toISOString(),
        waitingNum: i >= 8 ? i - 7 : null,
      })),
      nextCursor: 0,
      hasNext: false,
      totalCount: 10,
    });
  }),

  // 3. 비로그인 유저 개별 정보 조회 (GET /registrations/:regId)
  http.get(path('/registrations/:regId'), async ({ params }) => {
    const { regId } = params;
    await delay(200);

    return HttpResponse.json({
      status: 'CONFIRMED',
      waitlistPosition: 0,
      registrationPublicId: regId as string,
      reservationEmail: 'guest@example.com',
    });
  }),

  // src/mocks/handlers/event.ts 에 추가

  // 4. 내가 생성한/참여한 일정 목록 조회 (GET /events/me)
  http.get(path('/events/me'), async () => {
    await delay(300);

    // 제공해주신 response 형식에 맞춘 데이터
    return HttpResponse.json({
      events: [
        {
          publicId: 'my-event-1',
          title: '내가 만든 테니스 모임',
          startsAt: '2026-02-10T10:00:00.000Z',
          endsAt: '2026-02-10T12:00:00.000Z',
          registrationStartsAt: '2026-02-01T00:00:00.000Z',
          registrationEndsAt: '2026-02-09T23:59:59.000Z',
          capacity: 10,
          totalApplicants: 5,
        },
        {
          publicId: 'my-event-2',
          title: '참여 중인 자바스크립트 스터디',
          startsAt: '2026-02-15T19:00:00.000Z',
          endsAt: '2026-02-15T21:00:00.000Z',
          registrationStartsAt: '2026-02-05T00:00:00.000Z',
          registrationEndsAt: '2026-02-14T18:00:00.000Z',
          capacity: 4,
          totalApplicants: 4,
        },
        {
          publicId: 'my-event-3',
          title: '주말 러닝 크루 모집',
          startsAt: '2026-02-22T08:00:00.000Z',
          endsAt: '2026-02-22T10:00:00.000Z',
          registrationStartsAt: '2026-02-10T00:00:00.000Z',
          registrationEndsAt: '2026-02-21T20:00:00.000Z',
          capacity: 20,
          totalApplicants: 12,
        },
      ],
      nextCursor: '2026-02-22T08:00:00.000Z',
      hasNext: false,
    });
  }),
];
