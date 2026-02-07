import { authHandlers } from './handlers/auth';
import { eventHandlers } from './handlers/event';
import { userHandlers } from './handlers/user';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...eventHandlers,
  // 앞으로 추가될 postHandlers, commentHandlers 등을 여기에 추가합니다.
];
