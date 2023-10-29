export interface WinstonAdapterInterface {
    info(message: string, data?: any): void;
    error(message: string, data?: any): void;
}