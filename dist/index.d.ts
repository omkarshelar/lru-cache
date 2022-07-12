type cacheEntryKey = string | null;
interface cacheEntry<T> {
    value: T;
    nextEntry: cacheEntryKey;
    previousEntry: cacheEntryKey;
}
export class Cache<T> {
    maxSize: number;
    constructor(maxSize?: number);
    getSize(): number;
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    invalidateKey(key: string): void;
    isEmpty(): boolean;
    invalidateCache(): void;
    getAll(): Record<string, cacheEntry<T>>;
}

//# sourceMappingURL=index.d.ts.map
