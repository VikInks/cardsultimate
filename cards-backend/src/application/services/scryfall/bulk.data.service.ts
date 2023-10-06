import {spawn} from 'child_process';
import {BulkDataServiceInterface} from "../../../config/interfaces/services/bulk.data.service.interface";
import {CardRepositoryInterface} from "../../../config/interfaces/repositories/card.repository.interface"; // Importez votre interface de repository de cartes

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

    /**
     * @public
     * @method getBulkData
     * @description Method that gets bulk data from scryfall. It uses a python script to get the data and then stores it in a json file.
     * @returns {Promise<void>}
     * @throws {Error}
     * @version 1.0.0
     * @author VikInks
     */
    async getBulkData(): Promise<void> {
        return new Promise((resolve, reject) => {
            const python = spawn("python", ["./cards-backend/src/framework/script/scryfall_bulk.py"]);
            python.stdout.on("data", async (data: any) => {
                console.log(data.toString());
                const bulkData = JSON.parse(data.toString());
                await this.checkUpdateData(bulkData);
                resolve();
            });
            python.stderr.on("error", (error: any) => {
                reject(error);
            });
        });
    }

    private async checkUpdateData(bulkData: any[]): Promise<void> {
        const json = require("../../../data/scryfall-default-cards.json");
        if(!json) return;
        const newCards = [];
        for(let i = 0; i < bulkData.length; i++) {
            if(bulkData[i].id !== json[i].id) {
                newCards.push(bulkData[i]);
            }
        }

        if(newCards.length > 0) {
            await this.cardRepository.update(newCards);
        }
    }
}
