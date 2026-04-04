import { EventForm } from '@/components/EventForm';
import type { FormValues } from '@/components/EventForm';
import useAuthStore from '@/hooks/useAuthStore';
import useEvent from '@/hooks/useEvent';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function NewEvent() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { createEvent, loading } = useEvent();

  const defaultValues = useMemo<FormValues>(() => {
    const now = new Date();
    const regiEndDate = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 3 days later
    return {
      title: '',
      capacity: 4,
      isFromNow: true,
      isBounded: false,
      regiStartDate: now,
      regiEndDate,
      eventStartDate: new Date(regiEndDate.getTime() + 24 * 60 * 60 * 1000),
      eventEndDate: undefined,
      location: '',
      description: '',
    };
  }, []);

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
      toast.success('모임이 성공적으로 생성되었습니다!');
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <EventForm
      pageTitle="모임 만들기"
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      loading={loading}
      onBack={() => navigate(-1)}
      submitButtonText="저장"
      saveDialogTitle="모임을 저장하시겠습니까?"
      saveDialogDescription="모임을 저장한 이후에도 수정 및 삭제가 가능합니다."
      mode="create"
    />
  );
}
