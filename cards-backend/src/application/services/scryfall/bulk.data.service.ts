import {BulkDataServiceInterface} from "../../../config/interfaces/services/bulk.data.service.interface";
import {CardRepositoryInterface} from "../../../config/interfaces/repositories/card.repository.interface";
import axios from 'axios';

type ResponseData = {
    object: string,
    id: string,
    type: string,
    updated_at: string,
    uri: string,
    name: string,
    description: string,
    size: number,
    download_uri: string,
    content_type: string,
    content_encoding: string,
};

/**
 * @class BulkDataService
 * @public
 * @implements {BulkDataServiceInterface}
 * @description BulkDataService class that implements BulkDataServiceInterface. This class is used to get bulk data from scryfall. It also has a method to get a card image from scryfall.
 * @author VikInks
 * @version 1.0.0
 */
export class BulkDataService implements BulkDataServiceInterface {
    constructor(private readonly cardRepository: CardRepositoryInterface) {}

    async getBulkData(): Promise<void> {
        await this.getCardData();
    }

    private async checkUpdateData(bulkData: string): Promise<void> {
        const json = require("../../../data/scryfall-default-cards.json");
        if (!json) return;

        const newCards: any[] = [];
        const bulkDataArray = bulkData.split('\n');

        const oldCardsMap = new Map(json.map((c: any) => [c.id, c]));

        for (const line of bulkDataArray) {
            const card = JSON.parse(line);
            if (!card) continue;

            if (!oldCardsMap.has(card.id)) {
                newCards.push(card);
            }
        }

        if (newCards.length > 0) {
            await this.cardRepository.update(newCards);
        }
    }

    private async getCardData(): Promise<void> {
        try {
            const { data: bulkData } = await axios.get('https://api.scryfall.com/bulk-data');
            const allCardsData = bulkData.data.find((data: ResponseData) => data.name === 'All Cards');

            if (allCardsData) {
                await this.callPythonService(allCardsData.download_uri);
            }
        } catch (error) {
            console.error(`Failed to fetch bulk data: ${error}`);
        }
    }

    private async callPythonService(url: string): Promise<any> {
        try {
            const response = await axios.post('http://python:5000/get_card_data', {url});
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch bulk data: ${error}`);
            return null;
        }
    }
}
