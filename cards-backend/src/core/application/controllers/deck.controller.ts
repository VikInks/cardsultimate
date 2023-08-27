import {DeckControllerInterface} from "../../domain/interfaces/controllers/deck.controller.interface";

import {DeckServiceInterface} from "../../domain/interfaces/services/deck.service.interface";
import {Route, Post, Delete} from "../../framework/router/custom/decorator";
import {CustomError} from "../../framework/error/customError";
import {HttpRequest, HttpResponse} from "../../domain/interfaces/adapters/server.interface";

@Route("/deck")
export class DeckController implements DeckControllerInterface {
    constructor(
        private readonly deckService: DeckServiceInterface,
    ) {
    }

    @Post("/create")
    async createDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        if (!req.user?.id) throw new CustomError(500, 'Error creating deck');
        await this.deckService.createDeck(req.body, req.user.id).then((deck) => {
            res.status(201).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    @Delete("/delete/:id")
    async deleteDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        if (!req.user?.id) throw new CustomError(500, 'Error deleting deck');
        await this.deckService.deleteDeck(req.params.id, req.user.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    @Post("/get/:id")
    async getDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        await this.deckService.getDeck(req.params.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    @Post("/get")
    async getDecks(req: HttpRequest, res: HttpResponse): Promise<void> {
        if (!req.user?.id) throw new CustomError(500, 'Error getting decks');
        return this.deckService.getDecks(req.user.id).then((decks) => {
            res.status(200).json(decks);
        }).catch((err) => {
            throw new CustomError(500, err);
        });
    }

    @Post("/update/:id")
    async updateDeck(req: HttpRequest, res: HttpResponse): Promise<void> {
        try {
            if (!req.user?.id) throw new CustomError(500, 'Error updating deck');
            await this.deckService.updateDeck(req.body, req.user.id).then((deck) => {
                res.status(200).json(deck);
            }).catch((err) => {
                throw new CustomError(500, err);
            });
        } catch (err) {
            throw new CustomError(500, 'Error updating deck');
        }
    }

}