import UserAvatar from '@/components/UserAvatar';
import type { UserPreview } from '@/types/events';
import type { EventId } from '@/types/schemas';
import { ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
interface GuestsPreviewProps {
  guests: UserPreview[];
  totalCount: number;
  eventId: EventId;
}

export default function GuestsPreview({
  guests,
  totalCount,
  eventId,
}: GuestsPreviewProps) {
  const navigate = useNavigate();

  const extraCount = totalCount - guests.length;
  const showPlusIcon = totalCount > 5 && extraCount > 0;

  const handleNavigate = () => navigate(`/event/${eventId}/guests`);

  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 영역 */}
      <button
        onClick={handleNavigate}
        className="w-full flex justify-between items-center group transition-colors cursor-pointer"
      >
        <span className="body-strong">참여자 명단({totalCount}명)</span>
        <ChevronRightIcon className="size-6 text-[#303030] group-hover:text-gray-500 transition-colors" />
      </button>

      {/* 아바타 및 플러스 아이콘 배치 영역 */}
      <div className="flex items-center justify-start gap-1 min-w-0 flex-1">
        {/* 최대 5개의 아바타 노출 */}
        {guests.map((p) => (
          <UserAvatar
            key={p.id}
            name={p.name}
            imageUrl={p.profileImage ?? undefined}
          />
        ))}

        {/* 조건부 플러스(+) 아이콘 (최대 6번째 자리에 배치) */}
        {showPlusIcon && (
          <div className="size-10 rounded-full bg-muted flex items-center justify-center">
            <span className="body-small text-[#757575]">+{extraCount}</span>
          </div>
        )}

        {/* 참여자가 0명일 때의 안내 문구 */}
        {totalCount === 0 && (
          <p className="body-base text-[#757575]">아직 참여자가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
