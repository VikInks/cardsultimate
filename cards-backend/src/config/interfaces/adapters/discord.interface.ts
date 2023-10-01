export interface DiscordInterface {
    login(token: string): Promise<void>;
    sendMessage(channelId: string, content: string): Promise<void>;
}