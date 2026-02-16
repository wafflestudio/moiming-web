import { createEvent as createEventApi } from '@/api/events/event';
import type { CreateEventRequest } from '@/types/events';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useEvent() {
  const [loading, setLoading] = useState(false);

  const createEvent = async (data: CreateEventRequest) => {
    setLoading(true);
    try {
      const response = await createEventApi(data);
      if (response.status === 201 || response.status === 200) {
        toast.success('일정이 성공적으로 생성되었습니다!');
        return { success: true, eventId: response.data.publicId };
      }
      return { success: false, eventId: null };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('Failed to create event:', error);
      return { success: false, eventId: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createEvent,
  };
}
