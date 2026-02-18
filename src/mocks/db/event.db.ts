import type { EventDetailResponse } from '@/types/events';

interface MockEvent extends EventDetailResponse {
  // 필요한 경우 추가 필드 정의
}

export const eventDB: MockEvent[] = [
  {
    event: {
      publicId: 'event-1',
      title: '모이샤 정기모임',
      description: '2월 2일 모이샤 정기모임을 가집니다!',
      totalApplicants: 15,
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
      status: 'HOST',
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
  },
  {
    event: {
      publicId: 'my-event-1',
      title: '내가 만든 테니스 모임',
      description: '테니스 치실 분 구합니다.',
      totalApplicants: 5,
      location: '테니스장',
      startsAt: '2026-02-10T10:00:00.000Z',
      endsAt: '2026-02-10T12:00:00.000Z',
      registrationStartsAt: '2026-02-01T00:00:00.000Z',
      registrationEndsAt: '2026-02-09T23:59:59.000Z',
      capacity: 10,
    },
    creator: {
      name: '나',
      email: 'me@example.com',
      profileImage: 'https://github.com/shadcn.png',
    },
    viewer: {
      status: 'HOST',
      name: '나',
      waitlistPosition: 0,
      registrationPublicId: 'reg-my-1',
      reservationEmail: 'me@example.com',
    },
    capabilities: {
      shareLink: true,
      apply: true,
      wait: false,
      cancel: false,
    },
    guestsPreview: [],
  },
  {
    event: {
      publicId: 'my-event-2',
      title: '참여 중인 자바스크립트 스터디',
      description: '자바스크립트 스터디입니다.',
      totalApplicants: 4,
      location: '강남역',
      startsAt: '2026-02-15T19:00:00.000Z',
      endsAt: '2026-02-15T21:00:00.000Z',
      registrationStartsAt: '2026-02-05T00:00:00.000Z',
      registrationEndsAt: '2026-02-14T18:00:00.000Z',
      capacity: 4,
    },
    creator: {
      name: '스터디장',
      email: 'study@example.com',
      profileImage: 'https://github.com/shadcn.png',
    },
    viewer: {
      status: 'CONFIRMED',
      name: '나',
      waitlistPosition: 0,
      registrationPublicId: 'reg-my-2',
      reservationEmail: 'me@example.com',
    },
    capabilities: {
      shareLink: true,
      apply: false,
      wait: false,
      cancel: true,
    },
    guestsPreview: [],
  },
  {
    event: {
      publicId: 'my-event-3',
      title: '주말 러닝 크루 모집',
      description: '함께 달려요!',
      totalApplicants: 12,
      location: '한강공원',
      startsAt: '2026-02-22T08:00:00.000Z',
      endsAt: '2026-02-22T10:00:00.000Z',
      registrationStartsAt: '2026-02-10T00:00:00.000Z',
      registrationEndsAt: '2026-02-21T20:00:00.000Z',
      capacity: 20,
    },
    creator: {
      name: '러너',
      email: 'runner@example.com',
      profileImage: 'https://github.com/shadcn.png',
    },
    viewer: {
      status: 'WAITLISTED',
      name: '나',
      waitlistPosition: 2,
      registrationPublicId: 'reg-my-3',
      reservationEmail: 'me@example.com',
    },
    capabilities: {
      shareLink: true,
      apply: false,
      wait: true,
      cancel: true,
    },
    guestsPreview: [],
  },
];
