const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const crypto = require("crypto");

const TimerService = require("../services/TimerService");
const AuthService = require("../services/AuthService");

const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }

  const user = new AuthService().findUserBySessionId(req.cookies["sessionId"]);
  req.user = user;
  req.sessionId = req.cookies["sessionId"];
  next();
};

router.get("/", auth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

router.get("/api/timers", auth(), (req, res) => {
  const data = new TimerService().timers().filter((timer) => {
    if (req.query.isActive === "true") {
      return timer.isActive;
    } else if (req.query.isActive === "false") {
      return !timer.isActive;
    }
    return timer;
  });
  res.status(200).send(data);
});

router.post("/api/timers/:id/stop", auth(), (req, res) => {
  const timer = new TimerService().timers().find((t) => t.id === req.params.id);

  if (timer) {
    new TimerService().stopTimer(timer);
    res.status(200).json({ timer });
  } else {
    res.status(404).send("Timer not found");
  }
});

router.post("/api/timers", auth(), (req, res) => {
  const description = req.body.description;

  if (description) {
    const newTimer = new TimerService().createTimer(Date.now(), null, description, 10000, true, nanoid(), 2000);

    res.status(201).json(newTimer);
  } else {
    res.status(404).send("No description");
  }
});

router.post("/login", auth(), bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = new AuthService().findUserByUsername(username);
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

  if (!user || passwordHash !== user.password) {
    return res.redirect("/?authError=true");
  }

  const sessionId = new AuthService().createSession(user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.post("/signup", auth(), bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = new AuthService().createUser(username, password);
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

  if (!user || passwordHash !== user.password) {
    return res.redirect("/?authError=true");
  }

  const sessionId = new AuthService().createSession(user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.get("/logout", auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  await new AuthService().deleteSession(req.sessionId);
  res.clearCookie("sessionId").redirect("/");
});

module.exports = router;
