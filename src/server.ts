import HttpServer from "./core/httpServer";
import userRouter from "./routes/user";

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

app.get("/users/:userId", (req, res) => {
  const userId = req.paths.get("userId");
  return res.status(200).send("Hello : " + userId);
});

app.get("/users/:userId/accounts/hello", (req, res) => {
  const userId = req.paths.get("userId");
  return res.status(200).send("Hello : " + userId);
});

app.get("/users/:userId/accounts/:accountId", (req, res) => {
  const userId = req.paths.get("userId");
  const accountId = req.paths.get("accountId");
  return res
    .status(200)
    .send("Hello : " + userId + " | Account id is : " + accountId);
});

app.use("/users", userRouter);

app.server.listen(3005, () => {
  console.log("Server is ready.");
});
