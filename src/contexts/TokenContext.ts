import { createContext } from 'react';

export type TokenContext = {
  token: string | null;
};

export const TokenContext = createContext<TokenContext | null>(null);
