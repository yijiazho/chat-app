// src/App.js
import React from 'react';
import './App.css';
import Chat from './Chat';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>WebSocket Chat</h1>
                <Chat />
            </header>
        </div>
    );
}

export default App;
