// src/Chat.js
import React, { useState, useEffect } from 'react';

const Chat = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (connected) {
            const websocket = new WebSocket('ws://localhost:8000/ws');
            setWs(websocket);

            websocket.onmessage = (event) => {
                const newMessage = event.data;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            };
            
            websocket.onclose = () => {
                setConnected(false);
            };

            return () => {
                websocket.close();
            };
        }
    }, [connected]);

    const handleSendMessage = (e) => {
        console.log("handle send message")
        e.preventDefault();
        if (ws && message) {
            console.log(JSON.stringify(ws))
            ws.send(`${username}: ${message}`);
            setMessage('');
        }
    };

    const handleJoinChat = () => {
        if (username.trim() === '') {
            alert('Please enter a username.');
            return;
        }
        setConnected(true);
    };

    const handleLeaveChat = () => {
        setConnected(false);
        setMessages([]);
        if (ws) {
            ws.close();
        }
    };

    return (
        <div>
            {!connected ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleJoinChat}>Join Chat</button>
                </div>
            ) : (
                <div>
                    <button onClick={handleLeaveChat}>Leave Chat</button>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Chat;
