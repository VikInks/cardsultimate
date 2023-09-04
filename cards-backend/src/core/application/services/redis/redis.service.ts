import Redis from 'ioredis';
import {REDIS_CONFIG} from "../../../confg/redis.config";

export class RedisService {
    private client: Redis;

    constructor() {
        this.client = new Redis(REDIS_CONFIG)
    }

    async set(key: string, value: string, expiry?: number): Promise<string> {
        if (expiry) {
            return this.client.set(key, value, 'EX', expiry);
        }
        return this.client.set(key, value);
    }

    get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    delete(key: string): Promise<number> {
        return this.client.del(key);
    }
}