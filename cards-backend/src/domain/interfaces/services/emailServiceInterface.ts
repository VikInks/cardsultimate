export interface EmailServiceInterface {
	sendConfirmationEmail(to: string, subject: string, text: string, html: string): Promise<void>;
}