import {RegisterControllerInterface} from "../../domain/interfaces/controllers/register.controller.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../domain/interfaces/adapters/server.interface";
import {RegisterServiceInterface} from "../../domain/interfaces/services/register.service.interface";

export class RegisterController implements RegisterControllerInterface {
    constructor(private readonly registerService: RegisterServiceInterface) {
    }

    async register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        return await this.registerService.register(req, res, next);
    }
}