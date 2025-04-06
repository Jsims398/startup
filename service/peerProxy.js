const { WebSocketServer, WebSocket } = require("ws");

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  const connections = new Set();

  socketServer.on("connection", (socket) => {
    socket.isAlive = true;
    connections.add(socket);
    socket.on("message", function message(data) {
      try {
        const parsedData = JSON.parse(data);
        socketServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("pong", () => {
      socket.isAlive = true;
    });
    socket.on("close", () => {
      connections.delete(socket);
    });
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      connections.delete(socket);
    });
  });

  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) {
        console.log("Terminating inactive client");
        return client.terminate();
      }

      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  // console.log("WebSocket server initialized");
}

module.exports = { peerProxy };
