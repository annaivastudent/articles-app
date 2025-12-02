const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5001 });

wss.on("connection", (ws) => {
  console.log("Client connected");
});

function sendWS(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ message }));
  });
}

console.log("WS running on ws://localhost:5001");

module.exports = { sendWS };
