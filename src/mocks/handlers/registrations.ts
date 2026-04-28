import type { MyRegistrationsResponse } from '@/types/registrations';
import { http, HttpResponse, delay } from 'msw';
import { eventDB } from '../db/event.db';
import { path } from '../utils';

export const registrationHandlers = [
  // 내가 신청한 모임 조회 (GET /registrations/me)
  http.get(path('/registrations/me'), async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '5', 10);

    await delay(300);

    const myRegistrations = eventDB
      .filter((e) => e.viewer.status !== 'HOST' && e.viewer.status !== 'NONE')
      .map((e) => ({
        publicId: e.event.publicId,
        title: e.event.title,
        startsAt: e.event.startsAt || '',
        endsAt: e.event.endsAt || '',
        registrationStartsAt: e.event.registrationStartsAt || '',
        registrationEndsAt: e.event.registrationEndsAt || '',
        capacity: e.event.capacity || 0,
        confirmedCount: e.event.confirmedCount || 0,
        waitlistCount: e.event.waitlistCount || 0,
        status: e.viewer.status as 'CONFIRMED' | 'WAITLISTED' | 'CANCELED',
        waitlistedNum: e.viewer.waitlistPosition,
      }));

    const startIndex = page * size;
    const paginatedRegistrations = myRegistrations.slice(
      startIndex,
      startIndex + size
    );

    return HttpResponse.json<MyRegistrationsResponse>({
      registrations: paginatedRegistrations,
    });
  }),
];
