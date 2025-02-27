
term.clear()
term.setCursorPos(1, 1)

local myURL = "ws://localhost:8080"
local ws = http.websocket(myURL)

if ws == nil then
    print("Failed to connect to " .. myURL)
    return
else
    print("Connected to " .. myURL)
end

Action_Log = {}
Action_Color_Log = {}

function LogAction(text, color)
    table.insert(Action_Log, text)
    table.insert(Action_Color_Log, color)
end

function PopAction()
    local text = Action_Log[1]
    local color = Action_Color_Log[1]
    table.remove(Action_Log, 1)
    table.remove(Action_Color_Log, 1)
    return text, color
end

function Write_File(path, data)
    fs.delete(path)

    local file = fs.open(path, "w")

    if file then
        file.write(data) -- Write content to the file
        file.close() -- Close the file
        return true
    end
    return false
end

function Chat()
    local data, event, url, response
    local input

    while true do

        term.setTextColor(colors.blue)

        io.write("> ")
        input = read()

        if input == "exit" then
            break
        end

        ws.send(input)

        repeat
            event, url, response = os.pullEvent("websocket_message")
        until url == myURL and textutils.unserialiseJSON(response).type == "chat"

        data = textutils.unserializeJSON(response)

        term.setTextColor(colors.lightBlue)

        textutils.slowPrint(data.text)

        for i = 1, #Action_Log do
            local text, color = PopAction()
            term.setTextColor(color)
            print(text)
        end

    end
end

function AI_Functions()
    while true do
        local data, event, url, response

        repeat
            event, url, response = os.pullEvent("websocket_message")
        until url == myURL and textutils.unserialiseJSON(response).type == "file"

        data = textutils.unserializeJSON(response)

        if Write_File(data.name, data.code) then
            LogAction("File \"" .. data.name .. "\" Created", colors.green)
        else
            LogAction("Failed to create file \"" .. data.name .. "\"", colors.red)
        end
    end
end

parallel.waitForAny(Chat, AI_Functions)

ws.close()

term.setTextColor(colors.white)
print("Disconnected from server.")
