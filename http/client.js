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

const main = async () => {
  while (true) {
    try {
      const answer = await askQuestion("Client : ");
      const response = await fetch("http://localhost:3005/hello/there", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hello: true,
        }),
      });
      const data = await response.text();
      console.log("Date Observed : ", data);
      //console.log("From Server : ", JSON.stringify(data));
    } catch (error) {
      console.error("Error occured : ", error.message);
    }
  }
};

main();
