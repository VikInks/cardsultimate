// // error.handler.middleware.ts
//
// import { NotifierInterface } from "../../config/interfaces/utils/notifier.interface";
// import { HttpRequest, HttpResponse, NextFunction } from "../../config/interfaces/adapters/server.interface";
// import { CustomResponse } from "../error/customResponse";
//
//
// export function ErrorHandlerMiddlewareFactory(notifier: NotifierInterface): (err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) => Promise<void> {
//     const discord = new DiscordUtil(process.env.DISCORD_BOT_TOKEN!, process.env.GUILD_ID!);
//
//     return async function ErrorHandlerMiddleware(err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) {
//         const isDevelopment = process.env.NODE_ENV === 'development';
//
//         if (err instanceof CustomResponse) {
//             const channelName = `error-${err.statusCode}`;
//             const message = `
//                 User: ${req.user?.username} | ${req.user?.email} | ${req.user?.role} | ${req.user?.id}
//                 Date: ${new Date().toLocaleDateString()}
//                 Time: ${new Date().toLocaleTimeString()}
//                 Code: ${err.statusCode}
//                 Error: ${err.message}
//                 Stack: ${err.stack}
//             `;
//
//             if (!(await discord.channelExists(channelName))) {
//                 await discord.createChannel(channelName);
//             }
//             await discord.sendMessage(channelName, message);
//         }
//
//         // Notify the error to Discord
//         next(await notifier.notify(process.env.DISCORD_ERROR_CHANNEL_ID!, err.message));
//     }
// }
// //
// // const { createForum, logMessage } = require('./path/to/discordBotFile'); // Remplacez par le chemin vers votre fichier de bot Discord
// //
// // const handleErrors = (client) => {
// //     return async (err, req, res, next) => {
// //         const guildId = 'YOUR_GUILD_ID'; // Remplacez par l'ID de votre serveur Discord
// //         const guild = client.guilds.cache.get(guildId);
// //
// //         if (!guild) {
// //             console.error('Guild not found.');
// //             return res.status(500).send('Internal Server Error');
// //         }
// //
// //         if (!err) {
// //             return next();
// //         }
// //
// //         await createForum(guild);
// //         await logMessage(guild, `An error occurred: ${err.message}`);
// //
// //         res.status(500).send('An error occurred, logged in Discord.');
// //     };
// // };
// //
// // module.exports = handleErrors;
