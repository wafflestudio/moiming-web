import type { User, UserGroup } from '../../types/auth';
import apiClient from '../apiClient';

export default async function getMe(): Promise<User & { groups: UserGroup[] }> {
  const response = await apiClient.get('/auth/me');
  return response.data;
}
