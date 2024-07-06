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
        
    async def change_username(self, websocket: WebSocket, new_username: str):
        print("change user_name")
        print(self.active_connections)
        old_username = self.active_connections[websocket]
        self.active_connections[websocket] = new_username
        await self.broadcast(f"{old_username} has changed their username to {new_username}")
        print("user name changed successfully")

    async def broadcast(self, message: str):
        print("broadcasting...")
        for connection in self.active_connections.keys():
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def get():
    return HTMLResponse(open(os.path.join("frontend", "build", "index.html")).read())

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    print("python ws")
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            print("new message...")
            print(data)
            if data.startswith("/change_username "):
                new_username = data.split("/change_username ", 1)[1]
                print(new_username)
                await manager.change_username(websocket, new_username)
                print("change successful ......")
            else:
                current_username = manager.active_connections[websocket]
                await manager.broadcast(f"{current_username}: {data}")
    except WebSocketDisconnect:
        print("web socket disconnected")
        username = manager.disconnect(websocket)
        if username:
            await manager.broadcast(f"{username} has left the chat")
