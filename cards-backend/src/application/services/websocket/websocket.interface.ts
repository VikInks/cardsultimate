export interface WebSocketServerInterface {
    onConnection(callback: (ws: any) => void): void;
}