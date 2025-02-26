local myURL = "ws://localhost:8080"
local ws = http.websocket(myURL)

if ws == nil then
    print("Failed to connect to " .. myURL)
    return
else
    print("Connected to " .. myURL)
end

local event, url, message
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
        event, url, message = os.pullEvent("websocket_message")
    until url == myURL

    term.setTextColor(colors.red)

    print(message)

end

ws.close()

term.setTextColor(colors.white)
print("Disconnected from server.")
