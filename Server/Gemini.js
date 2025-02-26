// import * as GoogleGenerativeAI from "@google/generative-ai"
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDbn-X8T4Cu2ShLIc8uhUp4Kex1C3VLfmg"

const genAI = new GoogleGenerativeAI(API_KEY)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const conversation = model.startChat()

async function Chat(text) {

    let result = await conversation.sendMessage(text)
    return result.response.text()
}

module.exports = {
    Chat
};