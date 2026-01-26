import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import useEventDetail from '../hooks/useEventDetail';

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
import { ChevronLeftIcon } from 'lucide-react';

export default function Guests() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    loading,
    registrations: guests,
    handleFetchRegistrations,
  } = useEventDetail();

  useEffect(() => {
    if (id) {
      handleFetchRegistrations(id);
    }
  }, [id, handleFetchRegistrations]);

  const handleCancelGuest = (name: string | null) => {
    // 삭제 API 필요
    toast.success(`${name} 님의 참여가 취소되었습니다.`);
  };

  // 로딩 중이거나 데이터가 아직 없을 때 (리다이렉트 판단 전) 스피너나 빈 화면 표시
  if (loading || !guests) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      {/* 1. 상단 네비게이션 */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center px-6 py-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeftIcon />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold ml-4 text-black">
            참여자 명단({guests.length})
          </h1>
        </div>
      </div>

      {/* 2. 참여자 리스트 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col gap-8 mt-4">
        {guests.map((guest) => (
          <div
            key={guest.registrationId}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-none shadow-sm">
                <AvatarImage src={guest.email || undefined} />
                <AvatarFallback className="bg-black text-white text-xs">
                  {guest.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-black">
                  {guest.name}
                </span>
                {guest.email ? (
                  <span className="text-gray-400 text-lg">{guest.email}</span>
                ) : null}
              </div>
            </div>

            {/* 강제취소 버튼 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-[#333333] hover:bg-black text-white rounded-lg px-4 py-6 text-base font-bold"
                >
                  강제취소
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <strong>{guest.name}</strong> 님의 신청을 취소하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    취소 후 원복이 어렵습니다. 취소 메일이 참여자에게
                    전송됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>신청 유지하기</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleCancelGuest(guest.name)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    취소하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
}
