// lib/cache/memoryCache.ts

interface CacheEntry<T> {
    value: T;
    expiry: number;
}

const cache = new Map<string, CacheEntry<any>>(); // eslint-disable-line @typescript-eslint/no-explicit-any

export class MemoryCache {
    /**
     * Get a value from the cache. Returns null if missing or expired.
     */
    static get<T>(key: string): T | null {
        const entry = cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    /**
     * Set a value in the cache with a TTL (Time To Live).
     * @param ttlSeconds Duration in seconds
     */
    static set<T>(key: string, value: T, ttlSeconds: number): void {
        const expiry = Date.now() + ttlSeconds * 1000;
        cache.set(key, { value, expiry });
    }

    /**
     * Delete a value from the cache explicitly.
     */
    static delete(key: string): void {
        cache.delete(key);
    }
}
