export interface DiscordServiceInterface {
    initialize(token: string): Promise<void>;
}