import {DiscordServiceInterface} from "../../../config/interfaces/services/discord.service.interface";
import {DiscordInterface} from "../../../config/interfaces/adapters/discord.interface";


export class DiscordService implements DiscordServiceInterface {
    constructor(private readonly discord: DiscordInterface) {}

    async initialize(token: string): Promise<void> {
        await this.discord.login(token);
    }
}