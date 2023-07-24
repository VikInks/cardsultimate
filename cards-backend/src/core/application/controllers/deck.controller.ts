import {DeckControllerInterface} from "../../domain/interfaces/controllers/deck.controller.interface";
import {HttpRequest, HttpResponse} from "../../domain/interfaces/adapters/server.interface";
import {DeckServiceInterface} from "../../domain/interfaces/services/deck.service.interface";
import {Route, Post, Delete} from "../../framework/router/custom/decorator";
import {CustomError} from "../../framework/error/customError";
import {Controller} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";


@Controller()
@Route("/deck")
export default class DeckController implements DeckControllerInterface {
    constructor(
        private readonly deckService: DeckServiceInterface,
    ) {
    }

    /**
     * @swagger
     * /create:
     *   post:
     *     summary: Create a new deck
     *     tags: [Decks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               cards:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: number
     *                     name:
     *                       type: string
     *                     extension:
     *                       type: string
     *     responses:
     *       201:
     *         description: The created deck
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deck'
     *       500:
     *         description: Internal server error
     */
    @Post("/create")
    async createDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        const user = req.user;
        if (!user) throw new CustomError(401, "User not connected");
        await this.deckService.createDeck(req.body, user.id).then((deck) => {
            res.status(201).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    /**
     * @swagger
     * /delete/{id}:
     *   delete:
     *     summary: Delete a deck by ID
     *     tags: [Decks]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: Deck ID
     *     responses:
     *       200:
     *         description: The deleted deck
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deck'
     *       500:
     *         description: Internal server error
     */
    @Delete("/delete/:id")
    async deleteDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        if (!req.user) throw new CustomError(401, "User not connected");
        await this.deckService.deleteDeck(req.params.id, req.user.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    /**
     * @swagger
     * /get/{id}:
     *   post:
     *     summary: Get a deck by ID
     *     tags: [Decks]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: Deck ID
     *     responses:
     *       200:
     *         description: The requested deck
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deck'
     *       500:
     *         description: Internal server error
     */
    @Post("/get/:id")
    async getDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        await this.deckService.getDeck(req.params.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }


    /**
     * @swagger
     * /get:
     *   post:
     *     summary: Get all decks for the authenticated user
     *     tags: [Decks]
     *     responses:
     *       200:
     *         description: An array of decks
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Deck'
     *       500:
     *         description: Internal server error
     */
    @Post("/get")
    async getDecks(req: HttpRequest, res: HttpResponse): Promise<void> {
        if (!req.user) throw new CustomError(401, "User not connected");
        return this.deckService.getDecks(req.user.id).then((decks) => {
            res.status(200).json(decks);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    /**
     * @swagger
     * /update/{id}:
     *   post:
     *     summary: Update a deck by ID
     *     tags: [Decks]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: Deck ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               cards:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: number
     *                     name:
     *                       type: string
     *                     extension:
     *                       type: string
     *     responses:
     *       200:
     *         description: The updated deck
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Deck'
     *       500:
     *         description: Internal server error
     */
    @Post("/update/:id")
    async updateDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        // if (!req.user) throw new CustomError(401, "User not connected");
        // await this.deckService.updateDeck(req.params.id, req.body).then((deck) => {
        //     res.status(200).json(deck);
        // }).catch((err) => {
        //     throw new CustomError(500, err);
        // });
    }
}