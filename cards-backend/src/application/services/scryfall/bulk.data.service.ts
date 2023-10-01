import {CardServiceInterface} from "../../../config/interfaces/services/card.service.interface";
import {RedisServiceInterface} from "../../../config/interfaces/services/redis.service.interface";
import {REDIS_TIMER} from "../../../config/redis.config";
import {spawn} from 'child_process';
import {AxiosInterface} from "../../../config/interfaces/adapters/axios.interface";
import {BulkDataServiceInterface} from "../../../config/interfaces/services/bulk.data.service.interface";

export class BulkDataService implements BulkDataServiceInterface {
    constructor(
        private readonly cardService: CardServiceInterface,
        private readonly redisClient: RedisServiceInterface,
        private readonly axios: AxiosInterface
    ) {
    }

    async getBulkData(): Promise<void> {
        return new Promise((resolve, reject) => {
            const python = spawn("python", ["./cards-backend/src/framework/script/scryfall_bulk.py"]);
            python.stdout.on("data", (data: any) => {
                console.log(data.toString());
                resolve();
            });
            python.stderr.on("error", (error: any) => {
                reject(error);
            });
        });
    }

    async getCardImage(card_name: string): Promise<void | null> {
        const json_file: string = '../../src/scryfall/data/all_cards.json';
        if (!json_file) {
            try {
                await this.getBulkData();
                return this.getCardImage(card_name);
            } catch (error) {
                console.error("Error while fetching data from scryfall:", error);
                return null;
            }
        }

        const card = await this.cardService.getCards({name: card_name}).then((card) => card instanceof Array ? card[0] : card);

        if (!card) return null;

        try {
            const response = await this.axios.request.get(card.image_uris.small, {responseType: 'arraybuffer'});
            if (!response.data) return null;

            const imageBuffer = Buffer.from(response.data, 'binary');
            await this.redisClient.cacheData(`card_image_small_id:${card.id}`, imageBuffer, REDIS_TIMER.ONE_DAY);
        } catch (error) {
            console.error("Error while getting card image:", error);
            return null;
        }
    }
}
