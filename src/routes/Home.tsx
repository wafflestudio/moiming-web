import getMyEvents from '@/api/events/me';
import EventCardView from '@/components/EventCardView';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import type { MyEvent } from '@/types/events';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState<MyEvent[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    getMyEvents()
      .then((res) => {
        setEvents(res.data?.events || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isLoggedIn]);

  // if not logged in, show the landing page
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-10">
          <h1 className="heading text-center">
            모임이 쉬워진다!<br></br> 모이밍
          </h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link to="/register">
              <Button>계정 만들기</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">로그인하기</Button>
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
