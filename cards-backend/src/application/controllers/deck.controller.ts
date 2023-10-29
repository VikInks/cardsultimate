import {DeckControllerInterface} from "../../config/interfaces/controllers/deck.controller.interface";

import {DeckServiceInterface} from "../../config/interfaces/services/deck.service.interface";
import {Route, Post, Delete} from "../../framework/router/custom/decorator";
import {CustomResponse} from "../../framework/error/customResponse";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";

@Route("/deck")
export class DeckController implements DeckControllerInterface {
    constructor(
        private readonly deckService: DeckServiceInterface,
    ) {
    }

    @Post("/create")
    async createDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        if (!req.user?.id) return next(new CustomResponse(401, 'Unauthorized access'));
        await this.deckService.createDeck(req.body, req.user.id).then((deck) => {
            res.status(201).json(deck);
        }).catch((err) => {
            next(new CustomResponse(500, err));
        });
    }

    @Delete("/delete/:id")
    async deleteDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        if (!req.user?.id) return next(new CustomResponse(401, 'Unauthorized access'));
        await this.deckService.deleteDeck(req.params.id, req.user.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            next(new CustomResponse(500, err));
        });
    }

    @Post("/get/:id")
    async getDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        await this.deckService.getDeck(req.params.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            next(new CustomResponse(500, err));
        });
    }

    @Post("/get")
    async getDecks(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        if (!req.user?.id) return next(new CustomResponse(401, 'Unauthorized access'));
        return this.deckService.getDecks(req.user.id).then((decks) => {
            res.status(200).json(decks);
        }).catch((err) => {
            next(new CustomResponse(500, err));
        });
    }

    @Post("/update/:id")
    async updateDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        if (!req.user?.id) return next(new CustomResponse(401, 'Unauthorized access'));
        await this.deckService.updateDeck(req.body, req.user.id).then((deck) => {
            res.status(200).json(deck);
        }).catch((err) => {
            next(new CustomResponse(500, err));
        });
    }

}