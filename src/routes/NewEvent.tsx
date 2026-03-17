import { EventForm } from '@/components/EventForm';
import type { FormValues } from '@/components/EventForm';
import useAuthStore from '@/hooks/useAuthStore';
import useEvent from '@/hooks/useEvent';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function NewEvent() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { createEvent, loading } = useEvent();

  const now = new Date();
  const initialRegiEndDate = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 3 days later
  const initialEventStartDate = new Date(
    initialRegiEndDate.getTime() + 24 * 60 * 60 * 1000
  );

  const defaultValues: FormValues = {
    title: '',
    capacity: 4,
    isFromNow: true,
    isBounded: false,
    regiStartDate: now,
    regiEndDate: initialRegiEndDate,
    eventStartDate: initialEventStartDate,
    eventEndDate: undefined,
    location: '',
    description: '',
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const payload = {
      title: data.title,
      location: data.location || undefined,
      description: data.description || undefined,
      startsAt: data.eventStartDate.toISOString(),
      endsAt:
        data.isBounded && data.eventEndDate
          ? data.eventEndDate.toISOString()
          : undefined,
      capacity: data.capacity,
      waitlistEnabled: true,
      registrationStartsAt: data.isFromNow
        ? undefined
        : data.regiStartDate.toISOString(),
      registrationEndsAt: data.regiEndDate.toISOString(),
    };

    const eventId = await createEvent(payload);

    if (eventId) {
      toast.success('일정이 성공적으로 생성되었습니다!');
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <EventForm
      pageTitle="일정 만들기"
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      loading={loading}
      onBack={() => navigate(-1)}
      submitButtonText="저장"
      saveDialogTitle="일정을 저장하시겠습니까?"
      saveDialogDescription="참여자가 생기는 경우, 기본 정보를 수정하기 어려울 수 있습니다."
      mode="create"
    />
  );
}
