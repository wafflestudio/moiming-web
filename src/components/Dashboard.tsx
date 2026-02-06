import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import type { MyEvent } from '@/types/events';
import { CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router';

function NewEventButton() {
  return (
    <Button className="h-[40px]">
      <Link to="/new-event" className="flex gap-2">
        <Plus stroke="#F1F6FD" width="16" height="16" />
        <span className="single-line-body-base text-primary-foreground">
          새 일정 만들기
        </span>
      </Link>
    </Button>
  );
}

export default function Dashboard({ events = [] }: { events: MyEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex flex-col gap-5 items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-center">생성된 일정이 없어요.</h1>
            <span className="body-base text-[#757575] text-center">
              일정을 만들고 모임을 시작해보세요.
            </span>
          </div>
          <div className="flex px-1 py-1 justify-center">
            <CalendarIcon stroke="#B3B3B3" width="48" height="48" />
          </div>
          <NewEventButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 items-end">
      <NewEventButton />
      <div className="flex w-full flex-col gap-4">
        {events.map((event) => (
          <EventCard event={event} />
        ))}
      </div>
    </div>
  );
}
