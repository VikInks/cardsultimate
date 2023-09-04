import {HttpRequest, HttpResponse, NextFunction} from "../../domain/interfaces/adapters/server.interface";
import { CustomResponse } from "../error/customResponse";

export function ErrorHandlerMiddleware(err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log('Inside ErrorHandlerMiddleware:', res);

    if (err instanceof CustomResponse) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        const errorMessage = isDevelopment ? `
        Something went wrong: 
        ${err.message}. 
        Stack: ${err.stack}
        Req: ${req}` : 'Something went wrong! Please try again later.';
        res.status(500).json({ message: errorMessage });
    }
}
