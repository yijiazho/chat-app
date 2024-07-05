from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os

app = FastAPI()

app.mount("/static", StaticFiles(directory=os.path.join("frontend", "build", "static")), name="static")

## Responsible for multiple websockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections[websocket] = username
        await self.broadcast(f"{username} has joined the chat")

    def disconnect(self, websocket: WebSocket):
        username = self.active_connections.pop(websocket, None)
        if username:
            return username

    async def broadcast(self, message: str):
        for connection in self.active_connections.keys():
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def get():
    return HTMLResponse(open(os.path.join("frontend", "build", "index.html")).read())

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{username}: {data}")
    except WebSocketDisconnect:
        username = manager.disconnect(websocket)
        if username:
            await manager.broadcast(f"{username} has left the chat")
