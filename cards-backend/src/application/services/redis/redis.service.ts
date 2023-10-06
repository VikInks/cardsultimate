import {RedisServiceInterface} from "../../../config/interfaces/services/redis.service.interface";
import {RedisInterface} from "../../../config/interfaces/adapters/redis.interface";

/**
 * @implements {RedisServiceInterface}
 * @param {RedisInterface} redisAdapter
 * @public
 * @version 1.0.0
 * @description Redis service
 * @returns {void}
 * @author VikInks
 */
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