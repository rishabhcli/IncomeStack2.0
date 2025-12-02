import { useEffect, useState } from 'react';
import { load, save } from '../services/storageService';

type Reviver<T> = (value: unknown) => T;

export default function usePersistentState<T>(
  key: string,
  defaultValue: T,
  revive?: Reviver<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => load(key, defaultValue, revive));

  useEffect(() => {
    save(key, state);
  }, [key, state]);

  return [state, setState];
}
