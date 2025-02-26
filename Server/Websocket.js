const WebSocket = require('ws');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Websocket server
const port = 8080;
const server = new WebSocket.Server({ port: port });
console.log('WebSocket server running on ws://localhost:' + port);

// Gemini setup
const API_KEY = "AIzaSyDbn-X8T4Cu2ShLIc8uhUp4Kex1C3VLfmg"
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const conversation = model.startChat()

// WebSocket Logic
server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        Chat(message.toString()).then((result) => {
            ws.send(result);
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

// Gemini Chat function
// For ease of use
async function Chat(text) {
    let result = await conversation.sendMessage(text)
    return result.response.text()
}