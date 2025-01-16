const net = require("node:net");

const server = net.createServer((socket) => {
  console.log("Client is connected !");

  socket.on("data", (data) => {
    console.log("data buffer", data);
    console.log("Client : ", data.toString());
    socket.write(`Server : ${data}\n\r`);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    socket.end();
    console.log("Error occured : ", err);
  });
});

server.listen(3005, () => {
  console.log("Server bound.");
});
