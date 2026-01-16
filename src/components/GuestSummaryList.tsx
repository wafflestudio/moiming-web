import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

interface Guest {
  name: string;
  img?: string;
}

interface Props {
  guests: Guest[];
  totalCount: number;
  eventId: number | null;
}

export default function GuestSummaryList({
  guests,
  totalCount,
  eventId,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* 참여자 명단 헤더 */}
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="font-bold text-2xl text-black">
          참여자 명단({totalCount})
        </h2>
        <Button
          variant="link"
          onClick={() => navigate(`/event/${eventId}/guests`)}
          className="text-base font-bold text-black p-0 h-auto"
        >
          더보기
        </Button>
      </div>

      {/* 명단 박스 */}
      <div className="border-2 border-black p-10 bg-white">
        <div className="grid grid-cols-4 gap-8">
          {guests.map((p, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <Avatar className="w-16 h-16 border-none">
                <AvatarImage src={p.img} />
                <AvatarFallback className="bg-black text-white text-xs">
                  {p.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold text-gray-700 truncate w-full text-center">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
