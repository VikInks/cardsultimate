import {ErrorServiceInterface} from "../../../config/interfaces/services/error.service.interface";
import {DiscordServiceInterface} from "../../../config/interfaces/services/discord.service.interface";
import {UserServiceInterface} from "../../../config/interfaces/services/user.service.interface";


export class ErrorService implements ErrorServiceInterface {

    constructor(private readonly discord: DiscordServiceInterface, private readonly userService: UserServiceInterface) {}

    /**
     * handle
     * @param error
     * @param userId
     * @returns void
     * @description log the error to a discord channel
     */
    async handle(error: Error, userId: string): Promise<void> {
        // log the error to a discord channel
        const date = new Date();
        const time = date.toLocaleTimeString();
        const user = await this.userService.findById(userId);
        const message = `
        user: ${user?.email} | ${user?.username} | ${user?.role}
        date: ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
        time: ${time}
        error: ${error.message}
        `;
        await this.discord.postMessage(process.env.ERROR_CHANNEL_ID || '', message);
    }
}