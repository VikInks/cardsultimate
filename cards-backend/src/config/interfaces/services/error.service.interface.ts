export interface ErrorServiceInterface {
    handle(error: Error, userId: string): void;
}