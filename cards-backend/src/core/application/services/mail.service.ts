import {EmailServiceInterface} from "../../domain/interfaces/services/email.service.interface";
import {EmailInterface} from "../../infrastructure/adapters/email.adapter";


export class EmailService implements EmailServiceInterface {
	private readonly emailAdapter: EmailInterface;
	constructor(private readonly email: EmailInterface) {
		this.emailAdapter = email;
	}

	async sendConfirmationEmail(to: string, token: string | null): Promise<void> {
		const subject = 'Please confirm your account by clicking the link below:';
		const baseURL = process.env.NODE_ENV === 'production' ? 'https://cards.com' : 'http://localhost:8000';
		const html = `<p>Please confirm your account by clicking the link below:</p><a href="${baseURL}/user/confirm/${token}">Confirm Account</a>`;
		await this.emailAdapter.sendMail(to, subject, html);
	}
}