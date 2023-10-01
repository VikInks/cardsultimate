import { Client, TextChannel, Guild } from 'discord.js';

export class DiscordUtil {
    private client: Client;
    private guild: Guild | undefined;

    constructor(private token: string, private guildId: string) {
        this.client = new Client();
    }

    async init(): Promise<void> {
        await this.client.login(this.token);
        this.guild = this.client.guilds.cache.get(this.guildId);
    }

    async channelExists(channelName: string): Promise<boolean> {
        if (!this.guild) return false;
        const channel = this.guild.channels.cache.find(ch => ch.name === channelName && ch.type === 'text');
        return !!channel;
    }

    async createChannel(channelName: string): Promise<TextChannel | undefined> {
        if (!this.guild) return;
        const channel = await this.guild.channels.create(channelName, { type: 'text' });
        if (channel && channel.type === 'text') {
            return channel as TextChannel;
        }
    }

    async sendMessage(channelName: string, message: string): Promise<void> {
        if (!this.guild) return;
        const channel = this.guild.channels.cache.find(ch => ch.name === channelName && ch.type === 'text');
        if (channel && channel.type === 'text') {
            (channel as TextChannel).send(message);
        }
    }
}
