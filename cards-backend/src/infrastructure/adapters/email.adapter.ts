import nodemailer from "nodemailer";

export interface EmailInterface {
	sendMail(to: string, subject: string, html: string): Promise<void>;
}

export class EmailAdapter implements EmailInterface {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: "smtp.example.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	async sendMail(to: string, subject: string, html: string): Promise<void> {
		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to,
			subject,
			html,
		};

		await this.transporter.sendMail(mailOptions);
	}
}