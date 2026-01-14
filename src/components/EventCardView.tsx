import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { Events } from '@/types/schema';
import { getShortenedDate } from '@/utils/date';
import { ChevronRightIcon, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';

type Event = Events & { guests: number; registration_start: string | null };

function getDateLabel(
  startDateString: string | null,
  endDateString: string | null
) {
  if (!endDateString) {
    return '상시 모집 중';
  }

  const now = new Date();
  const endDate = new Date(endDateString!);

  if (startDateString && now < new Date(startDateString)) {
    return `${getShortenedDate(startDateString)}부터 모집`;
  }

  if (now <= endDate) {
    return `${getShortenedDate(endDateString)}까지 모집`;
  }

  return '모집 마감';
}

export default function EventCardView({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-8 items-center">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-2xl font-bold">개설한 일정이 없네요!</h1>
            <h2 className="text-base font-base">
              사람들과 새로운 일정을 잡아 볼까요?
            </h2>
          </div>
          <Link to="/new-event">
            <Button className="text-lg font-bold px-20 py-5">
              새로운 일정 만들기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ItemGroup className="gap-4">
      <Item variant="default" asChild role="listitem">
        <Link to="/new-event">
          <ItemMedia variant="icon">
            <Plus />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <h2 className="text-lg font-semibold line-clamp-1">
                새로운 일정 만들기
              </h2>
            </ItemTitle>
          </ItemContent>
        </Link>
      </Item>
      {events.map((event) => (
        <Item key={event.id} variant="outline" asChild role="listitem">
          <Link to={`/event/${event.id}`}>
            <ItemContent>
              <ItemTitle>
                <h2 className="text-lg font-semibold line-clamp-1">
                  {event.title}
                </h2>
              </ItemTitle>
              <ItemDescription>
                {getDateLabel(
                  event.registration_start,
                  event.registration_deadline
                )}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
      ))}
    </ItemGroup>
  );
}
