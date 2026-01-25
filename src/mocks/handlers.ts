import { authHandlers } from './handlers/auth';
import { userHandlers } from './handlers/user';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  // 앞으로 추가될 postHandlers, commentHandlers 등을 여기에 추가합니다.
];
