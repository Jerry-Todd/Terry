const WebSocket = require('ws');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Websocket server
const port = 8080;
const server = new WebSocket.Server({ port: port });
console.log('WebSocket server running on ws://localhost:' + port);

// Gemini setup
const API_KEY = "AIzaSyDbn-X8T4Cu2ShLIc8uhUp4Kex1C3VLfmg"
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

// WebSocket Logic
server.on('connection', async (ws) => {
    console.log('Client connected')

    const convo = await model.startChat()

    Chat(convo, `
        Your name is Terry, you are a AI assistant for a minecraft mod called computer craft built on Gemini 2.0 flash
        You are able to respond to the user and execute code on a computer craft computer
        If you want to respond to the user you must put your response in "<response> </response>"
        for expample: <response> Hello, my name is travis! </response>
        To write code you must put your code in "<code name=""> </code>"
        for example: <code name="script.lua"> print("Hello, my name is Travis!") </code>
        All code should be written in Lua and be compatible with ComputerCraft computers
        To execute a terminal command you must put your command in "<command> </command>"
        for example: <command> ls </command>
        All commands should be commands that computer craft computers support
    `)

    ws.on('message', (message) => {
        console.log(`Received: ${message}`)
        Chat(convo, message.toString()).then((result) => {
            console.log('Received: ' + result)
            let response = {
                type: 'chat',
                text: ExtractResponse(result)
            }
            ws.send(JSON.stringify(response))
            console.log('Sent: ' + response.type)
            console.log('Sent: ' + response.text)
            

            let file = ExtractCode(result)

            if (file != null) {
                response = {
                    type: 'file',
                    name: file[1],
                    code: file[2]
                }
    
                ws.send(JSON.stringify(response))
                console.log('Sent: ' + response.type)
                console.log('Sent: ' + response.code)
            }

        });
    });

    ws.on('close', () => console.log('Client disconnected'));


});

// Gemini Chat function
// For ease of use
async function Chat(convo,text) {
    let result = await convo.sendMessage(text)
    return result.response.text()
}

// Extract functions
function ExtractResponse(text) {
    const match = text.match(/<response>([\s\S]*?)<\/response>/);
    if (match) {
        return match[1]
    }
    return null
}
function ExtractCode(text) {
    const match = text.match(/<code\s+name="([^"]+)">([\s\S]*?)<\/code>/);
    if (match) {
        return match
    }
    return null
}