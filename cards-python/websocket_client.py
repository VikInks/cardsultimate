import json

from websocket import create_connection
import logging


def notify_server():
    ws = None
    ws_url = 'ws://nodejs-service:8081'
    data = 'JSON files successfully downloaded'
    try:
        ws = create_connection(ws_url, timeout=10)
        ws.send(json.dumps({"type": "notification", "message": data}))
        logging.info(f"Sent: {data}")
    except Exception as e:
        logging.error(f"WebSocket Error: {e}")
    finally:
        if ws:
            ws.close()
