export interface LoginServiceInterface {
	login(email: string, password: string): Promise<{ access_token: string } | null>;
	disconnect(): Promise<any>;
}
