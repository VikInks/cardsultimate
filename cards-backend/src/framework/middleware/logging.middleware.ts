import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {WinstonAdapterInterface} from "../../config/interfaces/adapters/winston.adapter.interface";

/**
 * Middleware to log HTTP requests
 * @param logger - WinstonAdapterInterface
 * @returns void
 */
export const loggingMiddleware = (logger: WinstonAdapterInterface) => {
    return {
        handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
            const startTime = Date.now();

            res.on('finish', () => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                const logData = {
                    method: req.method,
                    url: req.url,
                    status: res.statusCode,
                    responseTime: `${responseTime}ms`,
                };

                if (res.statusCode >= 400) {
                    logger.error('Error HTTP', logData);
                } else {
                    logger.info('HTTP', logData);
                }
            });

            next();
        }
    }
};