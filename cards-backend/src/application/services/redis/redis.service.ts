import {RedisServiceInterface} from "../../../config/interfaces/services/redis.service.interface";
import {RedisInterface} from "../../../config/interfaces/adapters/redis.interface";

export class RedisService implements RedisServiceInterface {
    constructor(private readonly redisAdapter: RedisInterface) {}

    async cacheData(key: string, data: any, expiry?: number): Promise<void> {
        await this.redisAdapter.set(key, JSON.stringify(data), expiry);
    }

    async getCachedData(key: string): Promise<any> {
        const data = await this.redisAdapter.get(key);
        return data ? JSON.parse(data) : null;
    }

    async deleteCachedData(key: string): Promise<void> {
        await this.redisAdapter.delete(key);
    }
}