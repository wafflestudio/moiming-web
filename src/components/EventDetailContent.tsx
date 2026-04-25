import type { DetailedEvent } from '@/types/events';
import type { EventViewType } from '@/types/events';
import { formatEventDate, getRemainingTime } from '@/utils/date';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface EventDetailContentProps {
  view: EventViewType;
  event: DetailedEvent;
}

interface ShortEventDetailContentProps {
  event: DetailedEvent;
}

export function EventDetailContent({ view, event }: EventDetailContentProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col rounded-lg border border-border p-4 gap-3">
        <h1 className="text-[#1E1E1E]">{event.title}</h1>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-1.5 body-base text-[#757575]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="break-keep">일시</span>
            </div>
            <span>
              {event.startsAt ? formatEventDate(event.startsAt) : '미정'}{' '}
              {event.endsAt ? `~ ${formatEventDate(event.endsAt)}` : ''}
            </span>
          </div>
          <div className="flex items-start gap-1.5 body-base text-[#757575]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span className="break-keep">장소</span>
            </div>
            <span>{event.location || '미정'}</span>
          </div>
          <div className="flex items-start gap-1.5 body-base text-[#757575]">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="break-keep">정원</span>
            </div>
            <span>
              {event.confirmedCount}/{event.capacity}명
              {event.waitlistCount && event.waitlistCount > 0
                ? ` (대기자 ${event.waitlistCount}명)`
                : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-lg p-4 gap-1.5 bg-[#F5F5F5]">
        <div className="flex items-start gap-1.5 body-base text-[#1E1E1E]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="w-16 break-keep">신청 기간:</span>
          </div>
          <span>
            {event.registrationStartsAt
              ? formatEventDate(event.registrationStartsAt) + ' ~ '
              : ''}
            {formatEventDate(event.registrationEndsAt)}
          </span>
        </div>
        <div className="flex justify-end">
          <span className="text-destructive body-base">
            {getRemainingTime(
              view,
              event.registrationEndsAt,
              event.registrationStartsAt
            )}
          </span>
        </div>
      </div>

      <div className="px-2 pb-6 border-b border-border">
        <p className="body-base text-[#1E1E1E]">{event.description}</p>
      </div>
    </div>
  );
}

export function ShortEventDetailContent({
  event,
}: ShortEventDetailContentProps) {
  return (
    <div className="w-full flex flex-col items-stretch gap-10">
      <section className="space-y-6">
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm space-y-4">
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
              <User /> <p>정원</p> {event.confirmedCount}/{event.capacity}명
              {event.waitlistCount && event.waitlistCount > 0
                ? ` (대기자 ${event.waitlistCount}명)`
                : ''}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
