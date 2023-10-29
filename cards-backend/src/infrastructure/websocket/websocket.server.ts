import { Server, WebSocket } from 'ws';
import {WebSocketServerInterface} from "../../application/services/websocket/websocket.interface"; // Import WebSocket from 'ws'

export class WebSocketServer implements WebSocketServerInterface {
    private wss: Server;

    constructor(port: number) {
        this.wss = new Server({ port });
    }

    onConnection(callback: (ws: WebSocket) => void): void { // Use the same WebSocket type
        this.wss.on('connection', (ws) => {
            callback(ws);
        });
    }
}
