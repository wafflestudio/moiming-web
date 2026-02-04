import { ScrollArea } from '@/components/ui/scroll-area';
import type { DetailedEvent } from '@/types/events';
import { useNavigate } from 'react-router';
import { formatEventDate } from '../utils/date';

interface EventDetailContentProps {
  schedule: DetailedEvent;
  totalApplicants: number;
}

// 아이콘
const IconChevronLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function EventDetailContent({
  schedule,
  totalApplicants,
}: EventDetailContentProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-start gap-10">
      {/* 1. 일시 및 장소 */}
      <div className="text-left space-y-3 w-full">
        <p className="text-lg sm:text-xl font-bold text-black">
          일시 {formatEventDate(schedule.startsAt)}
        </p>
        <p className="text-lg sm:text-xl font-bold text-black">
          장소 {schedule.location || '미정'}
        </p>
      </div>

      {/* 2. 신청 현황 버튼 */}
      <button
        onClick={() => navigate(`/event/${schedule.publicId}/guests`)}
        className="flex items-center text-lg font-bold group hover:opacity-70 transition-opacity"
      >
        {schedule.capacity}명 중{' '}
        <span className="text-black ml-2 font-extrabold">
          {totalApplicants}명 신청
        </span>
        <div className="rotate-180 ml-2 group-hover:translate-x-1 transition-transform text-black">
          <IconChevronLeft />
        </div>
      </button>

      {/* 3. 상세 설명 */}
      <ScrollArea className="h-40 w-full rounded-md border-none">
        <p className="text-base text-gray-500 leading-relaxed whitespace-pre-wrap pr-4">
          {schedule.description}
        </p>
      </ScrollArea>

      {/* 4. 마감 정보 (버튼 상단 문구) */}
      <p className="text-lg font-bold text-black">
        {schedule.registrationEndsAt
          ? `${formatEventDate(schedule.registrationEndsAt)} 모집 마감`
          : '상시 모집'}
      </p>
    </div>
  );
}
