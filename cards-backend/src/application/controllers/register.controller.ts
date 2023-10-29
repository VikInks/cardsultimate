import {RegisterControllerInterface} from "../../config/interfaces/controllers/register.controller.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {RegisterServiceInterface} from "../../config/interfaces/services/register.service.interface";

export class RegisterController implements RegisterControllerInterface {
    constructor(private readonly registerService: RegisterServiceInterface) {
    }

    async register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        return await this.registerService.register(req, res, next);
    }
}