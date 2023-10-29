export interface RedisInterface {
    set(key: string, value: string, expiry?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
}