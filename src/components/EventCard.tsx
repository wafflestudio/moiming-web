import TagMini from '@/components/TagMini';
import { Button } from '@/components/ui/button';
import type { MyEvent } from '@/types/events';
import type { MyRegistration } from '@/types/registrations';
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

interface EventCardProps {
  event?: MyEvent;
  registration?: MyRegistration;
  type: 'hosted' | 'joined';
}

export default function EventCard({
  event,
  registration,
  type,
}: EventCardProps) {
  const isHosted = type === 'hosted';

  // Extract values based on the object type
  const publicId = isHosted ? event?.publicId : registration?.publicId;
  const title = isHosted ? event?.title : registration?.title;
  const startsAt = isHosted ? event?.startsAt : registration?.startsAt;
  const endsAt = isHosted ? event?.endsAt : registration?.endsAt;
  const capacity = isHosted ? event?.capacity : registration?.capacity;
  const applicants = isHosted
    ? event?.confirmedCount
    : registration?.registrationCnt;
  const waitlistCount = isHosted ? event?.waitlistCount : null;
  const regStart = isHosted
    ? event?.registrationStartsAt
    : registration?.registrationStartsAt;
  const regEnd = isHosted
    ? event?.registrationEndsAt
    : registration?.registrationEndsAt;

  const joinLink = `${window.location.origin}/event/${publicId}`;

  const onCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    toast.success('링크가 복사되었습니다!', {
      description: '참여자에게 주소를 공유해 보세요.',
    });
  };

  const getStatusTag = () => {
    // For joined events, we might want to prioritize showing their application status
    if (!isHosted && registration?.status) {
      if (registration.status === 'CONFIRMED') {
        return (
          <TagMini
            background="bg-[#CFF7D3]"
            foreground="text-[#02542D]"
            content="참여 확정"
          />
        );
      } else if (registration.status === 'WAITLISTED') {
        return (
          <TagMini
            background="bg-[#E5F0FF]"
            foreground="text-[#0055CC]"
            content={`대기 ${registration.waitlistedNum}번`}
          />
        );
      } else if (registration.status === 'CANCELED') {
        return (
          <TagMini
            background="bg-[#FDD3D0]"
            foreground="text-[#900B09]"
            content="참여 취소"
          />
        );
      }
    }

    if (!regStart || !regEnd) return null;
    const nowDate = new Date();
    const startDate = new Date(regStart);
    const endDate = new Date(regEnd);

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
      <Link to={`/event/${publicId}`}>
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
                {applicants}/{capacity}명
                {waitlistCount && waitlistCount > 0
                  ? ` (대기자 ${waitlistCount}명)`
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col px-6 pt-3 pb-2 gap-1 bg-muted w-full rounded-b-lg items-start">
        <Link to={`/event/${publicId}`}>
          <div className="flex gap-1.5">
            <Clock stroke="#757575" width="16" />
            <span className="body-base">
              신청 기간: {getPeriod(regStart, regEnd)}
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
