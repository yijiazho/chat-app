// src/Chat.js
import React, { useState, useEffect } from 'react';
import './Chat.css'

const Chat = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (connected) {
            const websocket = new WebSocket(`ws://localhost:8000/ws/${username}`);
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
        e.preventDefault();
        if (ws && message) {
            ws.send(message);
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

    const handleUsernameChange = (e) => {
        console.log("change user name")
        e.preventDefault();
        if (ws && newUsername.trim() !== '') {
            console.log("new user name", newUsername)
            ws.send(`/change_username ${newUsername}`);
            setUsername(newUsername);
            setNewUsername('');
        }
    };

    return (
        <div className="chat-container">
            {!connected ? (
                <div className="join-container">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleJoinChat}>Join Chat</button>
                </div>
            ) : (
                <div className="chat-room">
                    <div className="messages">
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="input-container">
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
                        <form onSubmit={handleUsernameChange}>
                            <input
                                type="text"
                                placeholder="Change your username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <button type="submit">Change Username</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
