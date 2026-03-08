import type { ImageUploadRequest, ImageUploadResponse } from '@/types/images';
import apiClient from '../apiClient';

export async function uploadImage(
  data: ImageUploadRequest,
  prefix?: string
): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('image', data.image);

  const response = await apiClient.post<ImageUploadResponse>(
    '/images',
    formData,
    {
      params: { prefix },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
