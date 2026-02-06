import type { DetailedEvent } from '@/types/events';
import type { EventViewType } from '@/types/events';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { formatEventDate, getRemainingTime } from '../utils/date';

interface EventDetailContentProps {
  view: EventViewType;
  event: DetailedEvent;
}

export default function EventDetailContent({
  view,
  event,
}: EventDetailContentProps) {
  return (
    <div className="w-full flex flex-col items-start gap-10">
      <section className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-[1rem] p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {event.title}
          </h2>
          <div className="space-y-3 text-base text-gray-500">
            <p className="flex items-center gap-2">
              <Calendar /> <p>일시</p>{' '}
              {event.startsAt ? formatEventDate(event.startsAt) : '미정'}{' '}
              {event.endsAt ? `- ${formatEventDate(event.endsAt)}` : ''}
            </p>
            <p className="flex items-center gap-2">
              <MapPin /> <p>장소</p> {event.location || '미정'}
            </p>
            <p className="flex items-center gap-2">
              <User /> <p>정원</p> {event.totalApplicants}/{event.capacity}명
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 text-lg">
          <div className="flex items-start gap-2 text-gray-900">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-x-1.5 leading-snug">
              <span className="font-medium">신청 기간:</span>
              <span className="break-all">
                {event.registrationStartsAt
                  ? formatEventDate(event.registrationStartsAt) + ' - '
                  : ''}
                {formatEventDate(event.registrationEndsAt)}
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <span className="text-red-500 font-bold tracking-tight">
              {getRemainingTime(
                view,
                event.registrationEndsAt,
                event.registrationStartsAt
              )}
            </span>
          </div>
        </div>

        <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap pr-4">
          {event.description}
        </div>

        <hr className="border-gray-300" />
      </section>
    </div>
  );
}
