export interface CardControllerInterface {
    getCards(req: any, res: any, next: any): Promise<any>;
}