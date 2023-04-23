import cron from "node-cron";
import {UserServiceInterface} from "../core/domain/interfaces/services/user.service.interface";

export class CleanupService {
	private readonly userService: UserServiceInterface;
	constructor(private readonly user :UserServiceInterface) {
		this.userService = user;
	}

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
