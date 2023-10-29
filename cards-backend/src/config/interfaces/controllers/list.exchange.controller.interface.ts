import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";


export interface ListExchangeControllerInterface {
    createListExchange: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    getListExchange: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    updateListExchange: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    deleteListExchange: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
}