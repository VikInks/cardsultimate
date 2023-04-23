export interface LoginServiceInterface {
	login(email: string, password: string): Promise<{ access_token: string }>;
	disconnect(): Promise<any>;
}
