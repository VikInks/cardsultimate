export interface WebSocketServerInterface {
    onConnection(callback: (ws: any) => void): void;
    broadcast(data: string): void;
}