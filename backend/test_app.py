import pytest
import httpx
import asyncio
from fastapi import FastAPI
from fastapi.testclient import TestClient
from websockets import connect as ws_connect
from websockets.exceptions import ConnectionClosedOK

from backend.app import app, manager

client = TestClient(app)

@pytest.fixture
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
async def test_websocket_connection():
    async with ws_connect("ws://localhost:8000/ws/testuser") as websocket:
        await websocket.send("Hello World")
        message = await websocket.recv()
        assert message == "testuser: Hello World"
        await websocket.close()

@pytest.mark.asyncio
async def test_username_change():
    async with ws_connect("ws://localhost:8000/ws/user1") as websocket:
        await websocket.send("/change_username user2")
        message = await websocket.recv()
        assert message == "user1 has changed username to user2"
        await websocket.send("Hello from user2")
        message = await websocket.recv()
        assert message == "user2: Hello from user2"
        await websocket.close()

@pytest.mark.asyncio
async def test_broadcast():
    async with ws_connect("ws://localhost:8000/ws/user1") as ws1, ws_connect("ws://localhost:8000/ws/user2") as ws2:
        await ws1.send("Hello from user1")
        message = await ws1.recv()
        assert message == "user1: Hello from user1"
        message = await ws2.recv()
        assert message == "user1: Hello from user1"
        await ws1.close()
        await ws2.close()

@pytest.mark.asyncio
async def test_disconnection():
    async with ws_connect("ws://localhost:8000/ws/user1") as websocket:
        await websocket.send("Hello World")
        message = await websocket.recv()
        assert message == "user1: Hello World"
    message = await manager.broadcast("user1 has left the chat")
    async with ws_connect("ws://localhost:8000/ws/user2") as websocket:
        received_message = await websocket.recv()
        assert received_message == "user1 has left the chat"
        await websocket.close()
