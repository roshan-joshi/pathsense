import { createContext, useContext } from 'react';
import type { Engine } from '../timeline/engine';

export const EngineContext = createContext<Engine | null>(null);
export const useEngine = () => {
  const e = useContext(EngineContext);
  if (!e) throw new Error('Engine not available');
  return e;
};
