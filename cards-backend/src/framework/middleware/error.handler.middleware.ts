import { NotifierInterface } from "../../config/interfaces/utils/notifier.interface";
import { HttpRequest, HttpResponse, NextFunction } from "../../config/interfaces/adapters/server.interface";
import { CustomResponse } from "../error/customResponse";
import {DiscordUtil} from "../../config/utils/discord.utils";


export function ErrorHandlerMiddlewareFactory(notifier: NotifierInterface): (err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void> {
    const discord = new DiscordUtil(process.env.DISCORD_BOT_TOKEN!, process.env.GUILD_ID!);

    return async function ErrorHandlerMiddleware(err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) {
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (err instanceof CustomResponse) {
            const channelName = `error-${err.statusCode}`;
            const message = `
                User: ${req.user?.username} | ${req.user?.email} | ${req.user?.role} | ${req.user?.id}
                Date: ${new Date().toLocaleDateString()}
                Time: ${new Date().toLocaleTimeString()}
                Code: ${err.statusCode}
                Error: ${err.message}
                Stack: ${err.stack}
            `;

            if (!(await discord.channelExists(channelName))) {
                await discord.createChannel(channelName);
            }
            await discord.sendMessage(channelName, message);
        }

        // Notify the error to Discord
        next(await notifier.notify(process.env.DISCORD_ERROR_CHANNEL_ID!, err.message));
    }
}
