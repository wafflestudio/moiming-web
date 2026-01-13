import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Events } from '../types/schema';
import { formatEventDate } from '../utils/date';
// import useAuth from '../hooks/useAuth';

// --- shadcn UI 컴포넌트 ---
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- SVG 아이콘 컴포넌트 ---
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
const IconX = () => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 관리자 확인용
  // const { isAdmin, isLoggedIn } = useAuth();

  const [schedule, setSchedule] = useState<Events | null>(null);
  const [displayGuests, setDisplayGuests] = useState<
    { name: string; img: string | null }[]
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
      { name: '이름1', img: null }, // profile_image가 null인 경우
      { name: '이름2', img: 'https://via.placeholder.com/40' },
      { name: '이름3', img: null },
      { name: '이름4', img: null },
    ]);
  }, [id]);

  const handleDelete = () => {
    if (confirm('정말 이 일정을 삭제하시겠습니까?')) {
      // 삭제 API 필요
      console.info('Deleting event...');
      navigate('/');
    }
  };

  if (!schedule) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col relative pb-20">
      {/* 1. 상단 네비게이션 (가로 전체 활용) */}
      <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between px-6 py-8 sm:px-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IconChevronLeft />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold flex-1 ml-6 truncate text-black">
          {schedule.title}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
              <IconMoreVertical />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuLabel>일정 관리</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate('edit')}
                className="cursor-pointer"
              >
                일정 수정하기
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                일정 삭제하기
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>

      {/* 2. 메인 콘텐츠 (중앙 컨테이너 안에 왼쪽 정렬) */}
      <div className="max-w-2xl mx-auto w-full px-6 flex flex-col items-start gap-10">
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
        <div className="w-full text-left">
          <p className="text-base text-gray-500 leading-relaxed whitespace-pre-wrap">
            {schedule.description}
          </p>
        </div>

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
            <button
              onClick={() => {
                navigator.clipboard.writeText(joinLink);
                alert('링크가 복사되었습니다!');
              }}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              링크 복사하기
            </button>
          </div>
        </div>

        {/* 참여자 명단 섹션 */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="font-bold text-2xl text-black">
              {/* 신청 인원 필드 필요 */}
              참여자 명단(8)
            </h2>
            <button
              onClick={() => navigate('guests')}
              className="text-base font-bold border-b-2 border-black leading-none pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              더보기
            </button>
          </div>

          {/* 링크 복사 블록과 같은 너비의 명단 박스 */}
          <div className="border-2 border-black p-10 bg-white">
            <div className="grid grid-cols-4 gap-8">
              {displayGuests.map((p, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-16 h-16 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-black" />
                  )}
                  <span className="text-sm font-bold text-gray-700">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 관리자 도구 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-black">일정 관리</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <IconX />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('edit');
                  }}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl font-bold text-gray-900 transition-colors"
                >
                  일정 수정하기
                </button>
                <button className="w-full py-4 bg-red-50 hover:bg-red-100 rounded-2xl font-bold text-red-600 transition-colors">
                  일정 삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
