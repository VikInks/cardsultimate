import { Server, WebSocket } from 'ws';
import {WebSocketServerInterface} from "../../config/interfaces/services/websocket.interface";

export class WebSocketServer implements WebSocketServerInterface {
    private wss: Server;

    constructor(port: number) {
        this.wss = new Server({ port });
    }

    onConnection(callback: (ws: WebSocket) => void): void {
        this.wss.on('connection', (ws) => {
            callback(ws);
        });
    }

    broadcast(data: string): void {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
}

