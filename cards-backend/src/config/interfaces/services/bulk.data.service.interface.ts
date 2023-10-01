export interface BulkDataServiceInterface {
    getBulkData(): Promise<void>;
    getCardImage(card_name: string): Promise<void | null>;
}