import EventCardView from '@/components/EventCardView';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router';

const events = [
  {
    id: 1,
    title: '제2회 기획 세미나',
    description:
      '일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 ...',
    location: '서울대',
    start_at: '2026-02-02T18:00:00Z',
    end_at: '2026-02-02T20:00:00Z',
    guests: 12,
    capacity: 10,
    waitlist_enabled: true,
    registration_start: '2026-01-20T09:00:00Z',
    registration_deadline: '2026-02-02T17:00:00Z',
    created_by: 123,
    created_at: '2026-01-14T00:00:00Z',
    updated_at: '2026-01-14T00:00:00Z',
  },
  {
    id: 2,
    title: '2026 와커톤',
    description:
      '그동안 각자의 위치에서 몰두해 온 여러분들이 한자리에 모여 뜨거운 에너지를 나누고, 무박 2일간 개발에 집중하며 즐길 수 있는 행사입니다.',
    location: '성수 엘리스랩 라운지',
    start_at: '2026-01-01T18:00:00Z',
    end_at: '2026-02-13T20:00:00Z',
    guests: 6,
    capacity: 10,
    waitlist_enabled: true,
    registration_start: '2025-02-01T09:00:00Z',
    registration_deadline: '2026-02-02T17:00:00Z',
    created_by: 124,
    created_at: '2026-01-14T00:00:00Z',
    updated_at: '2026-01-14T00:00:00Z',
  },
];

export default function Home() {
  const { isLoggedIn } = useAuth();

  // if not logged in, show the landing page
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-10">
          <h1 className="text-4xl font-bold text-center">
            복잡한 모임 관리, <br></br> 모이샤로 쉽게!
          </h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg font-semibold px-25 py-5">
                계정 만들기
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="text-lg font-semibold px-25 py-5"
              >
                로그인하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // otherwise, show the dashboard with event cards
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <EventCardView events={events} />
      </div>
    </div>
  );
}
