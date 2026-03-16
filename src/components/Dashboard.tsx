import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import type { MyEvent } from '@/types/events';
import type { MyRegistration } from '@/types/registrations';
import { CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

function NewEventButton() {
  const navigate = useNavigate();

  const onNewEventClicked = () => {
    navigate('/new-event');
  };

  return (
    <Button onClick={onNewEventClicked} className="h-[40px]">
      <Plus stroke="#F1F6FD" width="16" height="16" />
      <span className="single-line-body-base text-primary-foreground">
        새 일정 만들기
      </span>
    </Button>
  );
}

interface DashboardProps {
  events?: MyEvent[];
  registrations?: MyRegistration[];
  type: 'hosted' | 'joined';
}

export default function Dashboard({
  events = [],
  registrations = [],
  type,
}: DashboardProps) {
  const isHosted = type === 'hosted';
  const dataList = isHosted ? events : registrations;

  if (!dataList || dataList.length === 0) {
    return (
      <div className="flex flex-1 w-full flex-col items-center justify-center pt-10">
        <div className="flex flex-col gap-5 items-center w-full max-w-md mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-center">
              {isHosted ? '생성된 일정이 없어요.' : '참여한 일정이 없어요.'}
            </h1>
            <span className="body-base text-[#757575] text-center">
              {isHosted
                ? '일정을 만들고 모임을 시작해보세요.'
                : '모임에 참여하고 일정을 확인해보세요.'}
            </span>
          </div>
          <div className="flex px-1 py-1 justify-center">
            <CalendarIcon stroke="#B3B3B3" width="48" height="48" />
          </div>
          {isHosted && <NewEventButton />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 items-end">
      {isHosted && <NewEventButton />}
      <div className="flex w-full flex-col gap-4">
        {isHosted
          ? events.map((event) => (
              <EventCard
                key={`event-${event.publicId}`}
                event={event}
                type="hosted"
              />
            ))
          : registrations.map((reg) => (
              <EventCard
                key={`reg-${reg.publicId}`}
                registration={reg}
                type="joined"
              />
            ))}
      </div>
    </div>
  );
}
