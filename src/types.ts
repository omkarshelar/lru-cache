export type cacheEntryKey = string | null;

export interface cacheEntry<T> {
  value: T;
  nextEntry: cacheEntryKey; // Newer entry
  previousEntry: cacheEntryKey; // Older entry
}
