import {WinstonAdapterInterface} from "../../config/interfaces/adapters/winston.adapter.interface";
import {ElasticsearchTransport} from "winston-elasticsearch";
import winston from "winston";

export class WinstonAdapter implements WinstonAdapterInterface {
    private readonly logger: winston.Logger;

    constructor() {
        const esTransportOpts = {
            level: 'info',
            clientOpts: {
                node: 'http://localhost:9200',
            },
        };

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new ElasticsearchTransport(esTransportOpts),
            ],
        });
    }

    error(message: string, data?: any): void {
        this.logger.error(message, data);
    }

    info(message: string, data?: any): void {
        this.logger.info(message, data);
    }
}