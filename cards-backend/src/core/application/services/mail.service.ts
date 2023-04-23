import {EmailServiceInterface} from "../../domain/interfaces/services/emailServiceInterface";
import {EmailInterface} from "../../infrastructure/adapters/email.adapter";


export class EmailService implements EmailServiceInterface {
	private readonly emailAdapter: EmailInterface;
	constructor(private readonly email: EmailInterface) {
		this.emailAdapter = email;
	}

	async sendConfirmationEmail(to: string, token: string | null, subject: string, html: string): Promise<void> {
		await this.emailAdapter.sendMail(to, subject, html);
	}
}