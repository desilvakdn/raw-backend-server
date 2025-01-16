const net = require("node:net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) =>
  new Promise((resolve) => {
    rl.question(question, (data) => {
      resolve(data);
    });
  });

const client = net.createConnection(
  {
    port: 3005,
    host: "localhost",
  },
  async () => {
    client.write("Hello Server!");

    while (true) {
      const answer = await askQuestion("Client : ");
      client.write(answer);
    }
  }
);
