// discord.adapter.ts

import { Client, TextChannel, GatewayIntentBits } from 'discord.js';
import {DiscordInterface} from "../../config/interfaces/adapters/discord.interface";

export class DiscordAdapter implements DiscordInterface {
    private client: Client;

    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    }

    async login(token: string): Promise<void> {
        await this.client.login(token);
    }

    async sendMessage(channelId: string, content: string): Promise<void> {
        const channel = this.client.channels.cache.get(channelId) as TextChannel;
        if (channel) {
            await channel.send(content);
        } else {
            throw new Error(`Channel with ID ${channelId} not found.`);
        }
    }
}