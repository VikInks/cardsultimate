import cron from "node-cron";
import {UserServiceInterface} from "../../../../config/interfaces/services/user.service.interface";
import {TimeupServiceInterface} from "../../../../config/interfaces/services/timeup.service.interface";
import {CardServiceInterface} from "../../../../config/interfaces/services/card.service.interface";
import {BulkDataServiceInterface} from "../../../../config/interfaces/services/bulk.data.service.interface";

export class TimeupService implements TimeupServiceInterface {
	constructor(
		private readonly userService :UserServiceInterface,
		private readonly bulkService :BulkDataServiceInterface
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

	updateCardDatabase(): void {
		cron.schedule("0 */12 * * *", async () => {
			try {
				const updatedCards = await this.bulkService.updateBulkData().then(() => {
					console.log("Cards updated:", updatedCards);
				});
			} catch (error) {
				console.error("Error while updating cards:", error);
			}
		});
	}
}
