import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <>
      <div className="w-full space-y-4 px-1">
        {/* 헤더 영역 */}
        <button
          onClick={handleNavigate}
          className="w-full flex justify-between items-center group transition-colors cursor-pointer"
        >
          <h2 className="font-bold text-lg text-gray-900 group-hover:text-gray-500 tracking-moiming">
            참여자 명단({totalCount}명)
          </h2>
          <ChevronRightIcon className="w-5 h-5 text-gray-900 group-hover:text-gray-500 transition-colors" />
        </button>

        {/* 아바타 및 플러스 아이콘 배치 영역 */}
        <div className="flex items-center justify-start gap-2.5">
          {/* 최대 5개의 아바타 노출 */}
          {guests.map((p) => (
            <Avatar
              key={p.id}
              title={p.name}
              className="w-16 h-16 border-none shadow-sm"
            >
              <AvatarImage
                src={p.profileImage ?? undefined}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-primary text-sm font-bold">
                {p.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ))}

          {/* 조건부 플러스(+) 아이콘 (최대 6번째 자리에 배치) */}
          {showPlusIcon && (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-50 shadow-sm">
              <span className="text-sm font-bold text-gray-500">
                +{extraCount}
              </span>
            </div>
          )}

          {/* 참여자가 0명일 때의 안내 문구 */}
          {totalCount === 0 && (
            <p className="text-lg text-gray-400 font-medium">
              아직 참여자가 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
