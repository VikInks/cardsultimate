import nodemailer from "nodemailer";
import * as fs from 'fs';
import * as path from 'path';

export interface EmailInterface {
	sendMail(to: string, subject: string, html: string): Promise<void>;
}

export class EmailAdapter implements EmailInterface {
	private readonly transporter: nodemailer.Transporter | null;
	private readonly logFolder: string;
	private readonly mode: 'development' | 'production';

	constructor(mode: 'development' | 'production') {
		this.mode = mode;
		this.transporter = null;
		this.logFolder = '';

		if (mode === 'production') {
			this.transporter = nodemailer.createTransport({
				host: "smtp.example.com",
				port: 587,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});
		} else {
			this.logFolder = path.join(__dirname, '..', '..', 'log', 'email');
			if (!fs.existsSync(this.logFolder)) {
				fs.mkdirSync(this.logFolder, { recursive: true });
			}
		}
	}

	async sendMail(to: string, subject: string, html: string): Promise<void> {
		if (this.mode === 'production' && this.transporter) {
			const mailOptions = {
				from: process.env.EMAIL_FROM,
				to,
				subject,
				html,
			};

			await this.transporter.sendMail(mailOptions);
		} else {
			const timestamp = new Date().toISOString();
			const filename = `${timestamp}-to-${to}.html`;

			const fileContent = `To: ${to} Subject: ${subject} HTML Content: ${html}`;

			const filePath = path.join('./src/email', filename);
			fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
		}
	}
}
