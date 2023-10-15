// import {DiscordInterface} from "../interfaces/adapters/discord.interface";
// import {NotifierInterface} from "../interfaces/utils/notifier.interface";
//
// export class DiscordNotifier implements NotifierInterface {
//     constructor(private readonly discord: DiscordInterface) {}
//
//     async notify(channelId:string, content:string): Promise<void> {
//         await this.discord.sendMessage(channelId, content);
//     }
// }