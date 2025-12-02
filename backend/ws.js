const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 5001 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (err) => console.error("WS Error:", err));
});

console.log("WebSocket running on ws://localhost:5001");

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ message }));
    }
  });
}

module.exports = { broadcast };

