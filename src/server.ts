import HttpServer from "./core/httpServer";

const app = new HttpServer();

app.get("/hello", (req, res) => {
  const val = req.params.get("welcome");
  console.log("val is : ", req.params.entries());
  return res.status(200).send("Hello Baby");
});

app.post("/api", (req, res) => {
  console.log(req.body);
  return res.status(200).send("Hello Samon");
});

app.post("/api1", (req, res) => {
  console.log(req.body);
  return res.status(200).json({
    hello: true,
  });
});

app.server.listen(3005, () => {
  console.log("Server is ready.");
});
