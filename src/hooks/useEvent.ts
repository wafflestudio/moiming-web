import { createEvent as createEventApi } from '@/api/events/event';
import type { CreateEventRequest } from '@/types/events';
import { useState } from 'react';

export default function useEvent() {
  const [loading, setLoading] = useState(false);

  const createEvent = async (
    data: CreateEventRequest
  ): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await createEventApi(data);
      return response.data.publicId;
    } catch (error: unknown) {
      console.error('Failed to create event:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createEvent,
  };
}
