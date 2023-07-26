import nodemailer from "nodemailer";
import * as fs from 'fs';
import * as path from 'path';
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";



export interface EmailInterface {
	sendMail(to: string, subject: string, html: string): Promise<void>;
}

@Adapter()
export default class EmailAdapter implements EmailInterface {
	private readonly transporter: nodemailer.Transporter | null;
	private readonly logFolder: string;

	constructor() {
		this.transporter = null;
		this.logFolder = '';

		if (process.env.NODE_ENV === 'production') {
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
		if (process.env.NODE_ENV === 'production' && this.transporter) {
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
