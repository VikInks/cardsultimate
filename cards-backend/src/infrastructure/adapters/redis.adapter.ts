import { createClient } from 'redis';
import { RedisInterface } from "../../config/interfaces/adapters/redis.interface";
import { REDIS_CONFIG } from "../../config/redis.config";

export class RedisAdapter implements RedisInterface {
    private client;

    constructor() {
        this.client = createClient(REDIS_CONFIG);
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect();
    }

    async set(key: string, value: string, expiry?: number): Promise<void> {
        if (expiry) {
            await this.client.set(key, value, {
                EX: expiry
            });
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}
