import TagMini from '@/components/TagMini';
import { Button } from '@/components/ui/button';
import type { MyEvent } from '@/types/events';
import { getPeriod } from '@/utils/date';
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  // MapPin,
  User,
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function EventCard({ event }: { event: MyEvent }) {
  const {
    publicId,
    title,
    startsAt,
    endsAt,
    capacity,
    totalApplicants,
    registrationStartsAt,
    registrationEndsAt,
  } = event;

  const joinLink = `${window.location.origin}/event/${publicId}`;

  const onCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    toast.success('링크가 복사되었습니다!', {
      description: '참여자에게 주소를 공유해 보세요.',
    });
  };

  const getStatusTag = () => {
    const nowDate = new Date();
    const startDate = new Date(registrationStartsAt);
    const endDate = new Date(registrationEndsAt);

    if (nowDate < startDate) {
      return (
        <TagMini
          background="border border-[#1E1E1E]"
          foreground="text-[#1E1E1E]"
          content="모집 전"
        />
      );
    } else if (nowDate < endDate) {
      return (
        <TagMini
          background="bg-[#CFF7D3]"
          foreground="text-[#02542D]"
          content="모집 중"
        />
      );
    } else {
      return (
        <TagMini
          background="bg-[#FDD3D0]"
          foreground="text-[#900B09]"
          content="모집 종료"
        />
      );
    }
  };

  return (
    <div
      key={`card-${publicId}`}
      className="w-full rounded-lg border border-border"
    >
      <Link to={`/event/${event.publicId}`}>
        <div className="flex flex-col px-4 pt-4 pb-3 gap-3">
          <h1>{title}</h1>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1.5">
              <Calendar stroke="#757575" width="16" />
              <span className="body-base text-[#757575]">일시</span>
              <span className="body-base text-[#757575]">
                {getPeriod(startsAt, endsAt)}
              </span>
            </div>
            {/* <div className="flex gap-1.5">
            <MapPin stroke="#757575" width="16" />
            <span className="body-base text-[#757575]">장소</span>
            <span className="body-base text-[#757575]">{location}</span>
          </div> */}
            <div className="flex gap-1.5">
              <User stroke="#757575" width="16" />
              <span className="body-base text-[#757575]">정원</span>
              <span className="body-base">
                {totalApplicants}/{capacity}명
                {/* {confirmedCount}/{capacity}명 (대기자 {waitlistCount}명) */}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col px-6 pt-3 pb-2 gap-1 bg-muted w-full rounded-b-lg items-start">
        <Link to={`/event/${event.publicId}`}>
          <div className="flex gap-1.5">
            <Clock stroke="#757575" width="16" />
            <span className="body-base">
              신청 기간: {getPeriod(registrationStartsAt, registrationEndsAt)}
            </span>
          </div>
        </Link>
        <div className="flex w-full place-content-between items-center">
          <Button
            variant="link"
            onClick={onCopyLink}
            className="flex gap-1.5 px-[-3]"
          >
            <span className="body-strong">링크 복사하기</span>
            <LinkIcon width="16" />
          </Button>
          {getStatusTag()}
        </div>
      </div>
    </div>
  );
}
