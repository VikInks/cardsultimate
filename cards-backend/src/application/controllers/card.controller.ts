import {CardServiceInterface} from "../../config/interfaces/services/card.service.interface";
import {CardControllerInterface} from "../../config/interfaces/controllers/card.controller.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";
import {cardParameters} from "../../config/interfaces/repositories/card.repository.interface";
import {Post, Route} from "../../framework/router/custom/decorator";

@Route("/cards")
export class CardController implements CardControllerInterface {

    constructor(
        private readonly cardService: CardServiceInterface
    ) {}

    /**
     * @swagger
     * /cards/{cards}:
     *   post:
     *     tags:
     *       - Cards
     *     summary: Get cards based on query parameters
     *     description: Fetches cards from the database based on query parameters and returns them.
     *     parameters:
     *       - in: path
     *         name: cards
     *         required: true
     *         schema:
     *           type: string
     *         description: The cards to fetch
     *       - in: query
     *         name: id
     *         schema:
     *           type: string
     *         description: Optional card ID
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Optional card name
     *       - in: query
     *         name: foil
     *         schema:
     *           type: boolean
     *         description: Optional foil status
     *     responses:
     *       200:
     *         description: Successfully fetched cards
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Card'
     *       500:
     *         description: Internal Server Error
     */
    @Post(`/:cards`, {middlewares: ['auth', 'rateLimitCards']})
    async getCards(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const params: cardParameters | cardParameters[] = req.query;
        try {
            const cards = await this.cardService.getCards(params);
            if (cards) {
                res.status(200).json(cards);
            }
        } catch (e) {
            next(new CustomResponse(500));
        }
    }
}