import type {
  CreateEventRequest,
  EventDetailResponse,
  GuestsResponse,
} from '@/types/events';
import { http, HttpResponse, delay } from 'msw';
import { eventDB } from '../db/event.db';
import { path } from '../utils';

export const eventHandlers = [
  // 1. 내가 생성한/참여한 모임 목록 조회 (GET /events/me)
  // :id 보다 먼저 정의되어야 'me'를 id로 인식하지 않음
  http.get(path('/events/me'), async ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const size = 5;

    await delay(300);

    // eventDB에서 내가 참여한(viewer.status가 NONE이 아닌) 이벤트만 필터링하거나
    // 간단히 모든 이벤트를 내 이벤트로 간주하여 반환 (데모 목적)
    const myEvents = eventDB
      // 실제로는 user token을 확인해서 필터링해야 하지만, 여기서는 예시로 일부만 반환하거나 전체 반환
      .filter((e) => e.viewer.status === 'HOST' || e.viewer.status === 'NONE')
      .map((e) => ({
        publicId: e.event.publicId,
        title: e.event.title,
        startsAt: e.event.startsAt,
        endsAt: e.event.endsAt,
        registrationStartsAt: e.event.registrationStartsAt,
        registrationEndsAt: e.event.registrationEndsAt,
        capacity: e.event.capacity,
        confirmedCount: e.event.confirmedCount,
        waitlistCount: e.event.waitlistCount,
      }));

    // Cursor pagination logic mock
    let startIndex = 0;
    if (cursor) {
      const idx = myEvents.findIndex((e) => e.startsAt === cursor);
      if (idx !== -1) startIndex = idx + 1; // start from next item
    }

    const paginatedEvents = myEvents.slice(startIndex, startIndex + size);
    const hasNext = startIndex + size < myEvents.length;
    const nextCursor = hasNext
      ? paginatedEvents[paginatedEvents.length - 1].startsAt
      : null;

    return HttpResponse.json({
      events: paginatedEvents,
      nextCursor,
      hasNext,
    });
  }),

  // 2. 모임 상세 정보 조회 (GET /events/:id)
  http.get(path('/events/:id'), async ({ params }) => {
    const { id } = params;
    await delay(300);

    const event = eventDB.find((e) => e.event.publicId === id);

    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json<EventDetailResponse>(event);
  }),

  // 3. 참여자 전체 명단 조회 (GET /events/:id/registrations)
  http.get(path('/events/:id/registrations'), async () => {
    await delay(200);

    return HttpResponse.json<GuestsResponse>({
      participants: Array.from({ length: 10 }).map((_, i) => ({
        publicId: `guest-${i}`,
        registrationId: `reg-id-${i}`,
        name: `참여자 ${i + 1}`,
        email: i < 8 ? `user${i}@example.com` : null,
        status: i < 8 ? 'CONFIRMED' : 'WAITLISTED',
        profileImage: i != 1 ? 'https://github.com/shadcn.png' : undefined,
        createdAt: new Date().toISOString(),
        waitingNum: i >= 8 ? i - 7 : null,
      })),
      nextCursor: 0,
      hasNext: false,
      totalCount: 10,
    });
  }),

  // 4. 비로그인 유저 개별 정보 조회 (GET /registrations/:regId)
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

  // 신청 취소 (DELETE /registrations/:id)
  http.delete(path('/registrations/:id'), async () => {
    await delay(200);
    return new HttpResponse(null, { status: 200 });
  }),

  // 5. 모임 생성 (POST /events)
  http.post(path('/events'), async ({ request }) => {
    const body = (await request.json()) as CreateEventRequest;
    await delay(500);

    const newId = `event-${Date.now()}`;
    const newEvent: EventDetailResponse = {
      event: {
        publicId: newId,
        title: body.title,
        description: body.description || '',
        confirmedCount: 0,
        waitlistCount: 0,
        location: body.location || '',
        startsAt: body.startsAt,
        endsAt: body.endsAt,
        registrationStartsAt: body.registrationStartsAt,
        registrationEndsAt: body.registrationEndsAt,
        capacity: body.capacity,
      },
      creator: {
        name: '나 (Host)',
        email: 'me@example.com',
        profileImage: 'https://github.com/shadcn.png',
      },
      viewer: {
        status: 'HOST',
        name: '나 (Host)',
        waitlistPosition: 0,
        registrationPublicId: `reg-${newId}`,
        reservationEmail: 'me@example.com',
      },
      capabilities: {
        shareLink: true,
        apply: false, // 호스트는 신청 불가
        wait: false,
        cancel: false, // 생성 직후 취소 불가능? (기획에 따라 다름)
      },
      guestsPreview: [], // 초기엔 참여자 없음
    };

    eventDB.push(newEvent);

    return HttpResponse.json(newEvent.event, { status: 201 });
  }),
];
