const STORAGE_PREFIX = 'incomestack:';

const isStorageAvailable = () => typeof window !== 'undefined' && 'localStorage' in window;

export function load<T>(key: string, fallback: T, revive?: (value: unknown) => T): T {
  if (!isStorageAvailable()) return fallback;
  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored) as unknown;
    return revive ? revive(parsed) : (parsed as T);
  } catch (error) {
    console.warn('Failed to load from storage', error);
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to storage', error);
  }
}

export function clear(key: string) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.warn('Failed to clear storage key', error);
  }
}
