import {CardServiceInterface} from "../../config/interfaces/services/card.service.interface";
import {BulkDataServiceInterface} from "../../config/interfaces/services/bulk.data.service.interface";
import {CardControllerInterface} from "../../config/interfaces/controllers/card.controller.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";
import {cardParameters} from "../../config/interfaces/repositories/card.repository.interface";
import {Post, Route} from "../../framework/router/custom/decorator";

@Route("/cards")
export class CardController implements CardControllerInterface {

    constructor(
        private readonly cardService: CardServiceInterface,
        private readonly bulkDataService: BulkDataServiceInterface
    ) {}

    @Post(`/:cards`, {middlewares: ['rateLimitCards', 'auth']})
    async getCards(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const params: cardParameters | cardParameters[] = req.query;
        try {
            const cards = await this.cardService.getCards(params);
            const images = await this.bulkDataService.getCardImage(params);
            if (cards && images !== null) {
                res.status(200).json(cards);
            }
        } catch (e) {
            next(new CustomResponse(500));
        }
    }
}