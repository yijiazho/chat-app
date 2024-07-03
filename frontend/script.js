
let ws;
let username;

function joinChat() {
    username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username.');
        return;
    }

    document.getElementById('join-chat').style.display = 'none';
    document.getElementById('chat-room').style.display = 'block';

    ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = function(event) {
        const messages = document.getElementById('messages');
        const message = document.createElement('li');
        const content = document.createTextNode(event.data);
        message.appendChild(content);
        messages.appendChild(message);
    };
}

ws.onmessage = function(event) {
    var messages = document.getElementById('messages');
    var message = document.createElement('li');
    var content = document.createTextNode(event.data);
    message.appendChild(content);
    messages.appendChild(message);
};

function sendMessage(event) {
    console.log("send message")
    var input = document.getElementById("messageText");
    const message = `${username}: ${input.value}`;

    ws.send(message);
    input.value = '';
    event.preventDefault();
}
