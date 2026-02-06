import getMyEvents from '@/api/events/me';
import AuthBox from '@/components/AuthBox';
import Dashboard from '@/components/Dashboard';
import useAuth from '@/hooks/useAuth';
import type { MyEvent } from '@/types/events';
import { useEffect, useState } from 'react';

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
      <div className="flex-1 flex justify-center">
        <div className="absolute top-1/4">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="heading text-center">
                모임이 쉬워진다!<br></br> 모이밍
              </h1>
              <span className="body-base text-center">
                여러분의 모임을 만들어보세요
              </span>
            </div>
            <AuthBox mode="register" />
          </div>
        </div>
      </div>
    );
  }

  // otherwise, show the dashboard with event cards
  return (
    <div className="flex-1 flex justify-center">
      <Dashboard events={events} />
    </div>
  );
}
