import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import type { Events } from '../types/schema';
import { formatEventDate } from '../utils/date';
// import useAuth from '../hooks/useAuth';

// shadcn UI 컴포넌트
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

// SVG 아이콘 컴포넌트
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
const IconMoreVertical = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const IconLink = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 관리자 확인용
  // const { isAdmin, isLoggedIn } = useAuth();

  const [schedule, setSchedule] = useState<Events | null>(null);
  const [displayGuests, setDisplayGuests] = useState<
    { name: string; img: string | undefined }[]
  >([]);

  const joinLink = `${window.location.origin}/join/${id}`;

  useEffect(() => {
    // 데이터 하드코딩
    const mockEvent: Events = {
      id: Number(id) || 1,
      title: '제2회 기획 세미나',
      description:
        '일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 일정설명 ...',
      location: '서울대',
      start_at: '2026-02-02T18:00:00Z',
      end_at: '2026-02-02T20:00:00Z',
      capacity: 10,
      waitlist_enabled: true,
      registration_deadline: '2026-02-02T17:00:00Z',
      created_by: 123, // 관리자 ID
      created_at: '2026-01-14T00:00:00Z',
      updated_at: '2026-01-14T00:00:00Z',
    };

    // 관리자 확인 로직
    // if (!isLoggedIn || !isAdmin(mockData.ownerName)) {
    //   alert('접근 권한이 없습니다. 관리자만 접근 가능합니다.');
    //   navigate('/'); // 혹은 로그인 페이지로 이동
    //   return;
    // }

    setSchedule(mockEvent);

    setDisplayGuests([
      { name: '이름1', img: undefined }, // profile_image가 null인 경우
      { name: '이름2', img: 'https://via.placeholder.com/40' },
      { name: '이름3', img: undefined },
      { name: '이름4', img: undefined },
    ]);
  }, [id]);

  const handleDelete = () => {
    // 삭제 API 필요
    console.info('Deleting event...');
    toast.error('일정이 삭제되었습니다.');
    navigate('/');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    toast.success('링크가 복사되었습니다!', {
      description: '참여자에게 주소를 공유해 보세요.',
    });
  };

  if (!schedule) return null;

  return (
    <div className="min-h-screen relative pb-20">
      {/* 1. 상단 네비게이션 */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-6 py-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <IconChevronLeft />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold flex-1 ml-4 truncate text-black">
            {schedule.title}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <IconMoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuItem
                onClick={() => navigate('edit')}
                className="cursor-pointer"
              >
                일정 수정하기
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent text-red-600 font-medium">
                    일정 삭제하기
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      정말 일정을 삭제하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      삭제된 일정은 복구할 수 없으며, 모든 참여 정보가 함께
                      사라집니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. 메인 콘텐츠*/}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col items-start gap-10">
        {/* 일정 정보 (왼쪽 정렬) */}
        <div className="text-left space-y-3 w-full">
          <p className="text-lg sm:text-xl font-bold text-black">
            일시 {formatEventDate(schedule.start_at)}
          </p>
          <p className="text-lg sm:text-xl font-bold text-black">
            장소 {schedule.location || '미정'}
          </p>
        </div>

        {/* 신청 현황 버튼 */}
        <button
          onClick={() => navigate('guests')}
          className="flex items-center text-lg font-bold group hover:opacity-70 transition-opacity"
        >
          {schedule.capacity}명 중{' '}
          <span className="text-black ml-2 font-extrabold">
            {/* 신청 인원 필드 필요 */} 8명 신청
          </span>
          <div className="rotate-180 ml-2 group-hover:translate-x-1 transition-transform text-black">
            <IconChevronLeft />
          </div>
        </button>

        {/* 상세 설명 */}
        <ScrollArea className="h-40 w-full rounded-md border-none">
          <p className="text-base text-gray-500 leading-relaxed whitespace-pre-wrap pr-4">
            {schedule.description}
          </p>
        </ScrollArea>

        {/* 모집 마감 및 링크 블록 */}
        <div className="w-full flex flex-col items-start">
          <p className="text-lg font-bold mb-6 text-black">
            {schedule.registration_deadline
              ? `${formatEventDate(schedule.registration_deadline)} 모집 마감`
              : '상시 모집'}
          </p>

          <div className="w-full bg-[#F8F9FA] rounded-3xl p-10 flex flex-col items-center gap-6 border border-gray-100">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-gray-400 scale-125">
                <IconLink />
              </div>
              <span className="text-base text-gray-500 font-medium break-all">
                {joinLink}
              </span>
            </div>
            <Button
              onClick={handleCopyLink}
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-black hover:bg-gray-800 transition-all"
            >
              링크 복사하기
            </Button>
          </div>
        </div>

        {/* 참여자 명단 섹션 */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="font-bold text-2xl text-black">
              {/* 신청 인원 필드 필요 */}
              참여자 명단(8)
            </h2>
            <Button
              variant="link"
              onClick={() => navigate('guests')}
              className="text-base font-bold text-black p-0 h-auto"
            >
              더보기
            </Button>
          </div>

          {/* 링크 복사 블록과 같은 너비의 명단 박스 */}
          <div className="border-2 border-black p-10 bg-white">
            <div className="grid grid-cols-4 gap-8">
              {displayGuests.map((p, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <Avatar className="w-16 h-16 border-none">
                    <AvatarImage src={p.img} />
                    <AvatarFallback className="bg-black text-white text-xs">
                      {p.name}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-gray-700">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
