
import redis from 'redis';
import { promisify } from 'util';
import {RedisInterface} from "../../config/interfaces/adapters/redis.interface";
import {REDIS_CONFIG} from "../../config/redis.config";


export class RedisAdapter implements RedisInterface {
    private client = redis.createClient(REDIS_CONFIG);
    private asyncGet = promisify(this.client.get).bind(this.client);
    private asyncSet = promisify(this.client.set).bind(this.client);
    private asyncDel = promisify(this.client.del).bind(this.client);

    async set(key: string, value: string, expiry?: number): Promise<void> {
        if (expiry) {
            await this.asyncSet(key, value, 'EX', expiry);
        } else {
            await this.asyncSet(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return this.asyncGet(key);
    }

    async delete(key: string): Promise<void> {
        await this.asyncDel(key);
    }
}
