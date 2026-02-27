import { updateEvent } from '@/api/events/event';
import { EventForm } from '@/components/EventForm';
import type { FormValues } from '@/components/EventForm';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/hooks/useAuthStore';
import useEventDetail from '@/hooks/useEventDetail';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    loading: fetchLoading,
    data,
    isDeleted,
    handleFetchDetail,
  } = useEventDetail(id);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (id) {
      handleFetchDetail(id).then((status) => {
        if (status === 'ERROR') navigate(`/event/${id}`);
      });
    }
  }, [id, handleFetchDetail, navigate]);

  if (isDeleted || !id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            삭제되었거나 없는 일정입니다.
          </h2>
          <p className="text-gray-500">
            요청하신 일정 정보를 찾을 수 없습니다.
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="rounded-xl px-8 h-12">
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  if (fetchLoading || !data) {
    return (
      <LoadingSkeleton
        loadingTitle="일정 정보를 불러오는 중입니다"
        message="잠시만 기다려주세요. 일정 정보를 불러오고 있습니다."
      />
    );
  }

  const { event } = data;

  const now = new Date();

  const defaultValues: FormValues = {
    title: event.title,
    capacity: event.capacity,
    isFromNow: false,
    isBounded: !!event.endsAt,
    regiStartDate: event.registrationStartsAt
      ? new Date(event.registrationStartsAt)
      : now,
    regiEndDate: event.registrationEndsAt
      ? new Date(event.registrationEndsAt)
      : new Date(now.getTime() + 72 * 60 * 60 * 1000),
    eventStartDate: event.startsAt ? new Date(event.startsAt) : now,
    eventEndDate: event.endsAt ? new Date(event.endsAt) : undefined,
    location: event.location || '',
    description: event.description || '',
  };

  const handleSubmit = async (formData: FormValues) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        location: formData.location?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        startsAt: formData.eventStartDate.toISOString(),
        endsAt:
          formData.isBounded && formData.eventEndDate
            ? formData.eventEndDate.toISOString()
            : undefined,
        capacity: formData.capacity,
        waitlistEnabled: true,
        registrationStartsAt: formData.isFromNow
          ? new Date().toISOString()
          : formData.regiStartDate.toISOString(),
        registrationEndsAt: formData.regiEndDate.toISOString(),
      };

      const response = await updateEvent(id, payload);

      if (response.status === 201 || response.status === 200) {
        toast.success('일정이 수정되었습니다.');
        navigate(`/event/${id}`);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('일정 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EventForm
      pageTitle="일정 수정하기"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      loading={isSubmitting}
      onBack={() => navigate(-1)}
      submitButtonText="수정하기"
      saveDialogTitle="일정을 수정하시겠습니까?"
      saveDialogDescription="참여자가 있는 경우, 모임 정보가 변경되면 혼선이 있을 수 있습니다."
    />
  );
}
