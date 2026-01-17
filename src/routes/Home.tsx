import EventCardView from '@/components/EventCardView';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router';

const events = [
  {
    id: 0,
    title: 'string',
    description: 'string',
    location: 'string',
    startAt: 0,
    endAt: 0,
    capacity: 0,
    waitlistEnabled: true,
    registrationDeadline: 0,
    createdBy: 0,
    createdAt: 0,
    updatedAt: 0,
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
