import cron from "node-cron";
import {UserServiceInterface} from "../../../config/interfaces/services/user.service.interface";
import {TimeupServiceInterface} from "../../../config/interfaces/services/timeup.service.interface";
import {CardServiceInterface} from "../../../config/interfaces/services/card.service.interface";

export class TimeupService implements TimeupServiceInterface {
	constructor(
		private readonly userService :UserServiceInterface,
		private readonly cardService :CardServiceInterface
	) {}

	removeUnconfirmedUsers(): void {
		cron.schedule("0 */12 * * *", async () => {
			try {
				const deletedUnconfirmedAccount = await this.userService.deleteUnconfirmedUsers();
				console.log("Unconfirmed users removed:", deletedUnconfirmedAccount);
			} catch
				(error) {
				console.error("Error while removing unconfirmed users:", error);
			}
		});
	}

	refreshCardDatabase(): void {
		cron.schedule("0 0 */1 * *", async () => {
			try {
				await this.cardService.refreshCardDatabase();
			} catch (error) {
				console.error("Error while refreshing cards database:", error);
			}
		});
	}
}
