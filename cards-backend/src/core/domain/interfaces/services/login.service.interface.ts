export interface LoginServiceInterface {
	login(email: string, password: string): Promise<{payload: object, access_token: string }>;
	disconnect(): Promise<any>;
}
