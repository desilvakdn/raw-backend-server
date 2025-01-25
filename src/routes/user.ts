import { Router } from "../core/protocols/http/router";

const router = new Router();

router.get("/account", (req, res) => {
  res.send("Hello World. This is my account");
});

export default router;
