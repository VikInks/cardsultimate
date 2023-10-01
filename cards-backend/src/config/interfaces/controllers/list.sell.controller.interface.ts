import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";

export interface ListSellControllerInterface {
    createListSell: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    getListSell: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    updateListSell: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
    deleteListSell: (req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void>;
}