const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini setup
const API_KEY = "AIzaSyDbn-X8T4Cu2ShLIc8uhUp4Kex1C3VLfmg"
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const conversation = model.startChat()

// Gemini Chat function
// For ease of use
async function Chat(text) {
    let result = await conversation.sendMessage(text)
    return result.response.text()
}

async function main() {

    
    
    let response

    response = await Chat("Hello")
    console.log(response)

}

main()