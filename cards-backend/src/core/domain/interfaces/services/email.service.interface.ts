export interface EmailServiceInterface {
	sendConfirmationEmail(to: string, subject: string): Promise<void>;
}