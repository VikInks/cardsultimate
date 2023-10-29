// discord.service.interface.ts

export interface DiscordServiceInterface {
    initialize(token: string): Promise<void>;
    postMessage(channelId: string, message: string): Promise<void>;
}