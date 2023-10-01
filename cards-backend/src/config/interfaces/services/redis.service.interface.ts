export interface RedisServiceInterface {
    cacheData(key: string, value: any, expiry?: number): Promise<void>;
    getCachedData(key: string): Promise<string | null>;
    deleteCachedData(key: string): Promise<void>;
}