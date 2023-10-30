import { BulkDataServiceInterface } from "../../../config/interfaces/services/bulk.data.service.interface";
import { CardRepositoryInterface } from "../../../config/interfaces/repositories/card.repository.interface";
import {AxiosAdapter} from "../../../infrastructure/adapters/axios.adapter";
import {WebSocketServerInterface} from "../../../config/interfaces/services/websocket.interface";

export class BulkDataService implements BulkDataServiceInterface {

    constructor(private readonly cardRepository: CardRepositoryInterface, private readonly axios: AxiosAdapter, private readonly webSocketServer: WebSocketServerInterface) {
        this.webSocketServer.onConnection((ws) => {
            ws.on('message', async (message: string) => {
                if (message === 'JSON files successfully downloaded') {
                    await this.updateBulkData();
                }
            });
        });
    }

    async updateBulkData(): Promise<void> {
        const result = await this.axios.request.get('http://localhost:5000/update_data');
        if (result.status === 200) {
            await this.cardRepository.update(result.data);
        } else {
            console.log('Error while updating bulk data');
        }
    }
}
