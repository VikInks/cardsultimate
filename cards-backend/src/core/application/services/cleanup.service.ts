import cron from "node-cron";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";


export class CleanupService {
	constructor(private readonly userService :UserServiceInterface) {}

	removeUnconfirmedUsers(): void {
		// Tâche s'exécutant toutes les 12 heures : "0 */12 * * *"
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
}
